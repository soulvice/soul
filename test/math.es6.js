import { pythag } from '../src/lib/math'
import { expect } from 'chai'

describe('#math - Pythagorean theorem', () => {
  it('expect to return the number 5', () => {
    let p = pythag('a=3 b=4');
    expect(p).to.be.a('number');
    expect(p).to.equal(5);
  });

  it('expect to return the number 3', () => {
    let p = pythag('c=5 b=4');
    expect(p).to.be.a('number');
    expect(p).to.equal(3);
  });

  it('expect to return the number 4', () => {
    let p = pythag('c=5 a=3');
    expect(p).to.be.a('number');
    expect(p).to.equal(4);
  });
});
