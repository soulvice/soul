import utils from '../src/lib/utils'
import { expect } from 'chai'


describe('#utils uid', () => {
  let uid1 = utils.uid(20);
  let uid2 = utils.uid(20);
  it('should be a string', () => {
    expect(uid1).to.be.a('string');
    expect(uid2).to.be.a('string');
  });
  it('should not be the same value', () => {
    expect(uid1).to.not.equal(uid2);
  });

});


describe('#utils version', () => {
  let ver = utils.VERSION;
  it('should be an object with 2 keys \"full\" and \"safe\"', () => {
    expect(ver).to.be.a('object');
    expect(ver).to.contain.all.keys('full', 'safe');
  });
});


describe('#utils generateAssetHash', () => {
  let assetHash = utils.generateAssetHash;
  it('should be a unique asset has with a length of 10', () => {
    expect(assetHash).to.be.a('string');
    expect(assetHash).to.have.lengthOf(10);
  });
});


describe('#utils defined values', () => {
  it('should be equal to 3600', () => {
    expect(utils.TIMES.ONE_HOUR_S).to.equal(3600);
  });
});
