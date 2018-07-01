import log from "../logger";
import db from "../database/index";
import _ from 'lodash';
import moment from 'moment';


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
    } else {
      res.json({ message: "No currency found." });
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

