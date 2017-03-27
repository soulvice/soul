import math from '../src/lib/math'
import { expect } from 'chai'

describe('#math - Pythagorean theorem', () => {
  it('expect to return the number 5', () => {
    let pythag = math.pythag('a=3 b=4');
    expect(pythag).to.be.a('number');
    expect(pythag).to.equal(5);
  });

  it('expect to return the number 3', () => {
    let pythag = math.pythag('c=5 b=4');
    expect(pythag).to.be.a('number');
    expect(pythag).to.equal(3);
  });

  it('expect to return the number 4', () => {
    let pythag = math.pythag('c=5 a=3');
    expect(pythag).to.be.a('number');
    expect(pythag).to.equal(4);
  });
});
