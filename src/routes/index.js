import log from "../logger";
import db from "../database/index";
import _ from 'lodash';


export default (app) => {
  app.get('/', (req, res) => {
    log.info('/ called');
    res.json({ message: 'You Made it!' });
  });

  app.get('/api/portfolios', (req, res) => {
    const data = db.load();
    const portArr = [];
    const port = data.portfolios.map(item => {
      const newObj =  _.cloneDeep(item);
      newObj.positions = [];
      data.positions.filter(item2 => {
        if (item.id === item2.portfolioId) {
          newObj.positions.push(item2);
        }
      });
      portArr.push(newObj);
    });
    res.json({ portfolios: portArr });
  })

  app.get('/api/portfolios/:curr', (req, res) => {
    const data = db.load();
    log.info('/ called');
    const portArr = [];
    const port = data.positions.filter(item => {
      if(item.currency === req.params.curr) {
        portArr.push(item);
      }
    });
    if (portArr.length > 0) {
      res.json({ portfolio: portArr });
    }
    res.json({ message: "No currency found." });
    
  });

  app.post('/api/portfolios', (req, res) => {
    const data = db.load();
    log.info('/ called');
    let count = 0;
    let portCount = 0;
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
      positions: [],
    };

    const newPosition = {
      id: count + 1,
      portfolioId: req.body.portfolioId,
      currency: req.body.currency,
      value: req.body.value,
      date: new Date(),
    };
    newPortfolio.positions.push(newPosition);
    data.portfolios.push(newPortfolio);
    data.positions.push(newPosition);
    res.json({ portfolio: newPortfolio });
  });

  app.post('/api/portfolios', (req, res) => {
    const data = db.load();
    log.info('/ called');
    let count = 0;
    const portData = data.portfolios.map(item => {
      if (item.id > count) {
        count = item.id;
      }
    });
    
    const newPortfolio = {
      id: count + 1,
      name: req.body.name,
      positions: [],
    };

    data.portfolios.push(newPortfolio);
    res.json({ portfolio: newPortfolio });
  });
};

