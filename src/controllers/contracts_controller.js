const { Op } = require("sequelize");
const contract_status = require("../enums/contract_status");
const user_type = require("../enums/user_type");

const getContractById = async (req, res) => {
  const { Contract } = req.app.get("models");
  const { id } = req.params;
  const { profile } = req;

  const contract = await Contract.findOne({
    where: {
      [Op.and]: [
        { id },
        profile.type === user_type.CLIENT ? { ClientId: profile.id } : { ContractorId: profile.id }
      ],
    },
  });

  if (!contract) return res.status(404).end();
  res.json(contract);
};

const getAllNonTerminatedContracts = async (req, res) => {
  const { Contract } = req.app.get("models");
  const { profile } = req;

  const contract = await Contract.findAll({
    where: {
      [Op.and]: [
        { status: { [Op.ne]: contract_status.TERMINATED } },
        profile.type === user_type.CLIENT ? { ClientId: profile.id } : { ContractorId: profile.id }
      ]
    }
  });

  if (!contract) return res.status(401).end();
  res.json(contract);
};

module.exports = {
  getContractById,
  getAllNonTerminatedContracts,
};
