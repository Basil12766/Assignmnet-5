/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Basil Tariq Student ID: 176320232 Date: 2025-03-21
*
*  Published URL: 
*
********************************************************************************/

const express = require('express');
const path = require('path');
const dataService = require('./modules/data-service');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

dataService.initialize()
  .then(() => console.log("Database connected successfully!"))
  .catch(err => console.log("Database connection error:", err));

app.get('/', (req, res) => {
    res.render('home', { page: '/' });
});

app.get('/about', (req, res) => {
    res.render('about', { page: '/about' });
});

app.get('/sites', (req, res) => {
    dataService.getAllSites()
    .then(sites => res.render('sites', { sites, page: '/sites' }))
    .catch(err => res.status(500).render('500', { message: err }));
});

app.get('/sites/:id', (req, res) => {
    dataService.getSiteById(req.params.id)
    .then(site => res.render('site', { site, page: '/sites' }))
    .catch(err => res.status(404).render('404', { message: err }));
});

app.get("/addSite", (req, res) => {
    dataService.getAllProvincesAndTerritories()
    .then(provinces => res.render("addSite", { provincesAndTerritories: provinces }))
    .catch(err => res.status(500).render('500', { message: err }));
});

app.post("/addSite", (req, res) => {
    dataService.addSite(req.body)
    .then(() => res.redirect("/sites"))
    .catch(err => res.status(500).render('500', { message: err }));
});

app.get("/editSite/:id", (req, res) => {
    Promise.all([
        dataService.getSiteById(req.params.id),
        dataService.getAllProvincesAndTerritories()
    ])
    .then(([site, provinces]) => {
        res.render("editSite", { site, provincesAndTerritories: provinces });
    })
    .catch(err => res.status(404).render("404", { message: err }));
});

app.post("/editSite", (req, res) => {
    dataService.editSite(req.body.siteId, req.body)
    .then(() => res.redirect("/sites"))
    .catch(err => res.status(500).render('500', { message: err }));
});

app.get("/deleteSite/:id", (req, res) => {
    dataService.deleteSite(req.params.id)
    .then(() => res.redirect("/sites"))
    .catch(err => res.status(500).render('500', { message: err }));
});

app.use((req, res) => {
    res.status(404).render('404', { message: 'Page Not Found!', page: '' });
});

const HTTP_PORT = process.env.PORT || 8080;
app.listen(HTTP_PORT, () => {
    console.log(`Server started at http://localhost:${HTTP_PORT}`);
});
