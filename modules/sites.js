const sitesData = require('../data/sites.json');

module.exports.getSites = (query) => {
  return new Promise((resolve, reject) => {
    let filteredSites = sitesData;

    if (query.region) {
      filteredSites = filteredSites.filter(site => 
        site.provinceOrTerritoryObj.region.toLowerCase() === query.region.toLowerCase());
    }

    if (query.provinceOrTerritory) {
      filteredSites = filteredSites.filter(site => 
        site.provinceOrTerritoryObj.name.toLowerCase() === query.provinceOrTerritory.toLowerCase());
    }

    if (filteredSites.length > 0) resolve(filteredSites);
    else reject('No sites found matching your criteria.');
  });
};

module.exports.getSiteById = (id) => {
  return new Promise((resolve, reject) => {
    const foundSite = sitesData.find(site => site.siteId === id);
    if (foundSite) resolve(foundSite);
    else reject('No site found with the provided ID.');
  });
};

