const { Op } = require("sequelize");
const contract_status = require('../enums/contract_status');
const user_type = require('../enums/user_type');

const getAllUnpaidJobs = async (req, res) => {
  const { Job, Contract } = req.app.get("models");
  const { profile } = req;

  const jobs = await Job.findAll({
    include: {
      model: Contract,
      where: {
        [Op.and]: [
          { status: { [Op.ne]: contract_status.TERMINATED } },
          profile.type === user_type.CLIENT ? { ClientId: profile.id } : { ContractorId: profile.id }
        ]
      },
    },
    where: { paid: null },
    raw: true,
    nest: true
  });

  if (jobs.length === 0) {
    return res.status(404).end();
  }

  return res.json(jobs);
};

const payJob = async (req, res) => {
  const sequelize = req.app.get("sequelize");
  const { Job, Contract, Profile } = req.app.get("models");
  const { profile } = req;
  const { job_id } = req.params

  if (profile.type === user_type.CONTRACTOR) {
    return res.status(401).json({ message: 'Only clients can pay for a job' }).end();
  }

  const job = await Job.findOne({
    include: {
      model: Contract,
      where: {
        [Op.and]: [
          { status: { [Op.ne]: contract_status.TERMINATED } },
          { ClientId: profile.id }
        ]
      },
      include: {
        model: Profile,
        as: 'Contractor'
      }
    },
    where: { id: job_id }
  });

  if (!job) return res.status(404).end();

  if (job.paid) return res.status(401).json({ message: "Job is already paid" })
  if (profile.balance < job.price) return res.status(401).json({ message: 'Insufficient balance' })

  const { Contractor } = job.Contract;
  const newClientBalance = profile.balance - job.price;
  const newContractorBalance = job.Contract.Contractor.balance + job.price;

  await sequelize.transaction(async (t) => {
    await job.update({ paid: true, paymentDate: new Date() }, { transaction: t });
    await Profile.update({ balance: newContractorBalance }, { where: { id: Contractor.id }, transaction: t });
    await Profile.update({ balance: newClientBalance }, { where: { id: profile.id }, transaction: t });
  });


  res.json({ message: 'The job was paid successfully!' });
};

module.exports = {
  getAllUnpaidJobs,
  payJob
}