require('dotenv').config();
require('pg');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
  }
);

const ProvinceOrTerritory = sequelize.define('ProvinceOrTerritory', {
  code: { type: Sequelize.STRING, primaryKey: true },
  name: Sequelize.STRING,
  type: Sequelize.STRING,
  region: Sequelize.STRING,
  capital: Sequelize.STRING
}, { timestamps: false });

const Site = sequelize.define('Site', {
  siteId: { type: Sequelize.STRING, primaryKey: true },
  site: Sequelize.STRING,
  description: Sequelize.TEXT,
  date: Sequelize.STRING,
  dateType: Sequelize.STRING,
  image: Sequelize.STRING,
  location: Sequelize.STRING,
  latitude: Sequelize.FLOAT,
  longitude: Sequelize.FLOAT,
  designated: Sequelize.STRING,
  provinceOrTerritoryCode: Sequelize.STRING
}, { timestamps: false });

Site.belongsTo(ProvinceOrTerritory, { foreignKey: 'provinceOrTerritoryCode' });

module.exports.initialize = () => {
  return sequelize.sync()
    .then(() => console.log("Database connected successfully!"))
    .catch(err => console.log("Database connection error:", err));
};

module.exports.getAllSites = () => {
  return Site.findAll({ include: ProvinceOrTerritory });
};

module.exports.getSiteById = (id) => {
  return Site.findOne({
    include: ProvinceOrTerritory,
    where: { siteId: id }
  })
  .then(site => {
    if (site) return site;
    else throw `Unable to find requested site with ID ${id}`;
  });
};

module.exports.getSitesByProvinceOrTerritoryName = (provinceOrTerritory) => {
  return Site.findAll({
    include: [ProvinceOrTerritory],
    where: {
      '$ProvinceOrTerritory.name$': {
        [Sequelize.Op.iLike]: `%${provinceOrTerritory}%`
      }
    }
  }).then(sites => {
    if (sites.length) return sites;
    else throw `Unable to find requested sites for ${provinceOrTerritory}`;
  });
};

module.exports.getSitesByRegion = (region) => {
  return Site.findAll({
    include: [ProvinceOrTerritory],
    where: {
      '$ProvinceOrTerritory.region$': region
    }
  }).then(sites => {
    if (sites.length) return sites;
    else throw `Unable to find requested sites in region ${region}`;
  });
};

module.exports.getAllProvincesAndTerritories = () => ProvinceOrTerritory.findAll();

module.exports.addSite = (siteData) => {
  return Site.create(siteData)
    .catch(err => {
      throw err.errors[0].message;
    });
};

module.exports.editSite = (id, siteData) => {
  return Site.update(siteData, { where: { siteId: id } })
    .then(() => Promise.resolve())
    .catch(err => {
      throw err.errors[0].message;
    });
};

module.exports.deleteSite = (id) => {
  return Site.destroy({ where: { siteId: id } })
    .then(() => Promise.resolve())
    .catch(err => {
      throw err.errors[0].message;
    });
};
