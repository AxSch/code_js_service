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
};