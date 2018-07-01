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

export default structurePortf;