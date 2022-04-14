const { Op } = require('sequelize');
const contract_status = require('../enums/contract_status');

const MAX_PERCENTAGE_AMOUNT_DEPOSIT = 0.25;

const depositAmmount = async (req, res) => {
  const sequelize = req.app.get('sequelize');
  const { Job, Contract, Profile } = req.app.get("models");
  const { userId } = req.params;
  const { amount } = req.body;

  console.log(userId)
  const jobs = await Job.findAll({
    include: {
      model: Contract,
      attributes: ['id'],
      where: {
        status: { [Op.ne]: contract_status.TERMINATED }
      },
      include: {
        model: Profile,
        as: 'Client',
        attributes: ['id', 'balance'],
        where: {
          id: userId
        }
      }
    },
    attributes: ['id', [sequelize.fn('sum', sequelize.col('price')), 'totalAmount']],
    where: { paid: null },
    raw: true,
    nest: true
  });

  const job = jobs.shift();
  const maxPermittedDeposit = job.totalAmount + (job.totalAmount * MAX_PERCENTAGE_AMOUNT_DEPOSIT);

  if (amount > maxPermittedDeposit) {
    return res.status(401).json({ message: `You cannot deposit an amount greater than ${MAX_PERCENTAGE_AMOUNT_DEPOSIT * 100} of the sum of your job payable` });
  }

  const newClientBalance = amount + job.Contract.Client.balance;

  await Profile.update({ balance: newClientBalance }, { where: { id: userId } });

  res.json({ message: 'Deposit made successfully!' });
}

module.exports = { depositAmmount }