import _ from 'lodash';
import moment from 'moment';

const structurePortf = (portfs, pos) => {
  let portArr = [];
  const port = portfs.map(item => {
    const newObj =  _.cloneDeep(item);
    newObj.positions = [];
    pos.filter(item2 => {
      if (item.id === item2.portfolioId) {
        newObj.positions.push(item2);
      }
    });
    portArr.push(newObj);
  });
  return portArr;
}

const filterOnCurrency = (pos, req) => {
  let posArr = [];
  const portfs = pos.filter(item => {
    if (item.currency === req) {
      posArr.push(item);
    }
  });
  return posArr;
}

const countId = (dataArr) => {
  let count = 0;
  const ids = dataArr.map(item => {
    if (item.id > count) {
      count = item.id;
    }
  });
  return count;
}

const createPortAndPos = (port, pos, req) => {
  let newPortsArr = [];
  const portCount = countId(port);
  const posCount = countId(pos);
  
  const newPortfolio = {
    id: portCount + 1,
    name: req.body.name,
  };
  
  const newPosition = {
    id: posCount + 1,
    portfolioId: portCount + 1,
    currency: req.body.currency,
    value: req.body.value,
    date: moment().format('YYYY-MM-DD'),
  };
  
  newPortsArr.push(newPortfolio);
  newPortsArr.push(newPosition);
  
  return newPortsArr;
}

const addPortAndPos = (portArr, posArr, newPortfolio) => {
  portArr.push(newPortfolio[0]);
  posArr.push(newPortfolio[1]);
}

const updatePort = (portArr, req) => {
  let clone = null;
  let updateArr = [];
  const entryToUpdate = portArr.filter(item=> {
    if(item.id === Number(req.params.id)){
      clone = _.cloneDeep(item);
      clone.name = req.body.name;
      updateArr.push(item, clone);
    }
  });

  return updateArr;
}

export {
  structurePortf,
  filterOnCurrency,
  createPortAndPos,
  addPortAndPos,
  updatePort,
};