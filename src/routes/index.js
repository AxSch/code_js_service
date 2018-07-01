import log from "../logger";
import _ from 'lodash';
import db from "../database/index";
import moment from 'moment';
import { 
  structurePortf,
  filterOnCurrency,
  createPortAndPos,
  addPortAndPos,
  updatePort,
 } from '../utils/helpers';


export default (app) => {
  app.get('/', (req, res) => {
    log.info('/ called');
    res.json({ message: 'You Made it!' });
  });

  app.get('/api/portfolios', (req, res) => {
    const data = db.load();
    log.info('/ called ALL PORTFOLIOS');
    const portfolioArr = structurePortf(data.portfolios, data.positions);
    res.json({ portfolios: portfolioArr });
  })

  app.get('/api/portfolios/:curr', (req, res) => {
    const data = db.load();
    log.info('/ called FILTER CURRENCY');
    const positionsArr = filterOnCurrency(data.positions, req.params.curr);
    const result = structurePortf(data.portfolios, positionsArr);
    if (positionsArr.length > 0) {
      res.json({ portfolios: result });
    } else {
      res.status(404).send("The currency you've entered, either doesn't exist or has been mistyped. \nPlease Try again.");
    } 
  });

  app.post('/api/portfolios', (req, res) => {
    let data = db.load();
    log.info('/ called ADD PORTFOLIO');
    const newPortfolio = createPortAndPos(data.portfolios, data.positions, req);
    addPortAndPos(data.portfolios, data.positions, newPortfolio);
    res.json({ portfolio: newPortfolio[0], positions: newPortfolio[1] });
  });

  app.put('/api/portfolios/:id', (req, res) => {
    let data = db.load();
    log.info('/ called UPDATE PORTFOLIO');
    const updateCred = updatePort(data.portfolios, req);
    data.portfolios.splice(data.portfolios.indexOf(updateCred[0]), 1, updateCred[1]);
    res.json({ portfolio: updateCred });
  });

  app.delete('/api/portfolios/:id', (req, res) => {
    let data = db.load();
    log.info('/ called');
    const test = data.portfolios.filter(item => {
      if(item.id === Number(req.params.id)) {
        return item;
      }
    });
    res.json({ portfolio: test });
    data.portfolios.map(item => {
      if (item === test[0]) {
        data.portfolios.splice(data.portfolios.indexOf(item), 1);
      }
    });
  });
};

