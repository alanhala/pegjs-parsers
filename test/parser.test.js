import { describe, it } from 'mocha'

import { expect } from 'chai'
import parser from '../src/parser'

describe('parser', () => {
  describe('number', () => {
    const parse = text => parser(text, { startRule: 'number' })

    it('parses a negative whole number', () => {
      expect(parse('-9')).to.deep.equal(-9)
    })

    it('parses a negative decimal number', () => {
      expect(parse('-10.2')).to.deep.equal(-10.2)
    })

    it('parses a non negative whole number', () => {
      expect(parse('200')).to.deep.equal(200)
    })

    it('parses a non negative decimal number', () => {
      expect(parse('502.4')).to.deep.equal(502.4)
    })

    it('fails when receiving characters', () => {
      expect(() => parse('hola')).to.throw()
    })

    it('fails when not receiving the decimal part', () => {
      expect(() => parse('9.')).to.throw()
    })
  })

  describe('string', () => {
    const parse = text => parser(text, { startRule: 'string' })

    it('parses any sequence of characters', () => {
      expect(parse('"hola2@. com"')).to.deep.equal('hola2@. com')
    })

    it('parses empty strings', () => {
      expect(parse('""')).to.equal('')
    })

    it('fails for unclosed strings', () => {
      expect(() => parse('"foo')).to.throw()
    })

    it('fails for unopened strings', () => {
      expect(() => parse('foo"')).to.throw()
    })

    it('fails when not receiving the quotes', () => {
      expect(() => parse('hola')).to.throw()
    })
  })

  describe('true', () => {
    const parse = text => parser(text, { startRule: 'true' })

    it('returns true value when receiving true', () => {
      expect(parse('true')).to.deep.equal(true)
    })

    it('fails when receiving another value', () => {
      expect(() => parse('lala')).to.throw()
    })
  })

  describe('false', () => {
    const parse = text => parser(text, { startRule: 'false' })

    it('returns false value when receiving false', () => {
      expect(parse('false')).to.deep.equal(false)
    })

    it('fails when receiving another value', () => {
      expect(() => parse('lala')).to.throw()
    })
  })

  describe('null', () => {
    const parse = text => parser(text, { startRule: 'null' })

    it('returns null value when receiving null', () => {
      expect(parse('null')).to.deep.equal(null)
    })

    it('fails when receiving another value', () => {
      expect(() => parse('lala')).to.throw()
    })
  })

  describe('hash', () => {
    const parse = text => parser(text, { startRule: 'hash' })

    it('parses empty hashes', () => {
      expect(parse('{}')).to.deep.equal({})
    })

    it('parses non empty hashes', () => {
      expect(parse('{"foo": "bar"}')).to.deep.equal({ foo: 'bar'})
    })

    it('parses non empty hashes with multiples keys', () => {
      expect(parse('{"foo": "bar" ,"asd": "asd"}')).to.deep.equal({ foo: 'bar', asd: 'asd'})
    })

    it('parses nested hashes', () => {
      expect(parse('{"foo": {"bar": 5}}')).to.deep.equal({ foo: { bar: 5 } })
    })

    it('fails for unclosed hashes', () => {
      expect(() => parse('{"foo": "bar"')).to.throw()
    })

    it('fails for unopened hashes', () => {
      expect(() => parse('"foo": "bar"}')).to.throw()
    })

    it('fails for non-string keys', () => {
      expect(() => parse('foo: "bar"}')).to.throw()
    })
  })

  describe('array', () => {
    const parse = text => parser(text, { startRule: 'array' })

    it('parses empty arrays', () => {
      expect(parse('[]')).to.deep.equal([])
    })

    it('parses non empty arrays', () => {
      expect(parse('["foo", "bar"]')).to.deep.equal(["foo", "bar"])
    })

    it('parses nested arrays', () => {
      expect(parse('[["foo", ["bar", 5]]]')).to.deep.equal([["foo", ["bar", 5]]])
    })

    it('fails for unclosed arrays', () => {
      expect(() => parse('["foo", "bar"')).to.throw()
    })

    it('fails for unopened arrays', () => {
      expect(() => parse('"foo", "bar"]')).to.throw()
    })
  })
})
