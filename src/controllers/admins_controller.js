const { Op } = require('sequelize');
const { format, startOfDay, endOfDay } = require('date-fns')
const contract_status = require("../enums/contract_status");

const DEFAULT_QUERY_LIMIT = 2;

const getBestProfessions = async (req, res) => {
  const sequelize = req.app.get("sequelize");
  const { Job, Contract, Profile } = req.app.get("models");
  const { start, end } = req.query;

  const formattedStartDate = format(startOfDay(start));
  const formattedEndDate = format(endOfDay(end));

  const bestProfessions = await Job.findAll({
    include: {
      model: Contract,
      where: { status: { [Op.ne]: contract_status.TERMINATED } },
      attributes: ['id'],
      include: {
        model: Profile,
        as: 'Contractor',
        attributes: ['profession'],
      },
    },
    attributes: ['id', [sequelize.fn('sum', sequelize.col('price')), 'amountEarned']],
    where: { paymentDate: { [Op.between]: [formattedStartDate, formattedEndDate] } },
    group: ["Contract.Contractor.id"],
    order: [[sequelize.col("amountEarned"), 'DESC']],
    raw: true,
    nest: true
  });

  if (bestProfessions.length === 0) return res.status(404).end();

  const { profession } = bestProfessions.shift().Contract.Contractor;
  return res.json({ profession: profession })
}

const getBestClients = async (req, res) => {
  const sequelize = req.app.get("sequelize");
  const { Job, Contract, Profile } = req.app.get("models");
  const { start, end, limit } = req.query;

  const formattedStartDate = format(startOfDay(start));
  const formattedEndDate = format(endOfDay(end));
  const queryLimit = (limit && !isNaN(limit)) ? limit : DEFAULT_QUERY_LIMIT;

  const bestClients = await Job.findAll({
    include: {
      model: Contract,
      where: { status: { [Op.ne]: contract_status.TERMINATED } },
      attributes: ['id'],
      include: {
        model: Profile,
        as: 'Client',
        attributes: ['id', [sequelize.literal("firstName || ' ' || lastName"), 'fullName']],
      },
    },
    attributes: [[sequelize.fn('sum', sequelize.col('price')), 'paid']],
    where: { paymentDate: { [Op.between]: [formattedStartDate, formattedEndDate] } },
    group: ["Contract.Client.id"],
    order: [[sequelize.col("paid"), 'DESC']],
    limit: queryLimit,
    raw: true,
    nest: true
  })

  const clients = bestClients.map(client => ({
    id: client.Contract.Client.id,
    fullName: client.Contract.Client.fullName,
    paid: client.paid
  }));

  return res.json(clients).end();
}

module.exports = { getBestProfessions, getBestClients }