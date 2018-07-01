import log from "../logger";
import db from "../database/index";
import moment from 'moment';
import { structurePortf, filterOnCurrency } from '../utils/helpers';


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
    let count = 0;
    let portCount = 0;
    log.info('/ called');
    
    const posData = data.positions.map(item => {
      if (item.id > count) {
        count = item.id;
      }
    });

    const portData = data.portfolios.map(item => {
      if (item.id > portCount) {
        portCount = item.id;
      }
    });
    
    const newPortfolio = {
      id: portCount + 1,
      name: req.body.name,
    };

    const newPosition = {
      id: count + 1,
      portfolioId: portCount + 1,
      currency: req.body.currency,
      value: req.body.value,
      date: moment().format('YYYY-MM-DD'),
    };
    
    data.portfolios.push(newPortfolio);
    data.positions.push(newPosition);
    res.json({ portfolio: newPortfolio, positions: newPosition });
  });

  app.put('/api/portfolios/:id', (req, res) => {
    let data = db.load();
    log.info('/ called');
    const test = data.portfolios.filter(item => {
      if(item.id === Number(req.params.id)) {
        item.name = req.body.name;
        data.portfolios.splice(data.portfolios.indexOf(item), 1, item)
        return item;
      }
    });
    res.json({ portfolio: test });
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

