import Errors, { SoulError, SoulInternalServerError } from '../src/lib/errors'
import { expect } from 'chai'

describe('#errors - Error List', () => {
  it('expect to have a list of error types', () => {
    expect(Errors).to.be.a('object');
    console.log(Errors);
  });

  it('expect error to be a Internal Error', () => {
    const internalError = new SoulInternalServerError();
    expect(internalError.statusCode).to.be.a('number');
    expect(internalError.statusCode).to.equal(500);
  });
});
