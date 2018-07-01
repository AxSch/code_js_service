import _ from 'lodash';

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

const filterOnCurrency = (pos, req)=> {
  let posArr = [];
  const portfs = pos.filter(item => {
    if (item.currency === req) {
      posArr.push(item);
    }
  });
  return posArr;
}


export {
  structurePortf,
  filterOnCurrency,
};