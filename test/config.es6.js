import { config } from '../src'
import { expect } from 'chai'
import path from 'path'

describe('#config - configuration tester', () => {
  it('expect to load configuration file', () => {
    let foundError = null;
    try {
      config.load(path.join(__dirname + '/test.json'));
    } catch(e) {
      foundError = e;
    }
    expect(foundError).to.equal(null);
  });

  it('expect to check url name', () => {
    let url = config.get('url');
    expect(url).to.be.a('string');
    expect(url).to.equal('http://sully.io');
  });

  it('expect to check content path name', () => {
    let cPath = config.get('paths:content');
    expect(cPath).to.be.a('string');
    expect(cPath).to.equal('/Users/soulvice/Projects/soul/content');
  });

  it('expect to check ssl path name', () => {
    let cPath = config.get('paths:ssl');
    expect(cPath).to.be.a('string');
    expect(cPath).to.equal('/Users/soulvice/Projects/soul/content/data/ssl');
  });

  it('expect to not change ssh:addr', () => {
    let cPath = config.get('ssh:addr');
    expect(cPath).to.be.a('string');
    expect(cPath).to.equal('user@192.168.0.1');
  });
});
