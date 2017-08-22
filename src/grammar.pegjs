json = hash

hash = '{' _ members:(member (_','_ member)*)? _ '}' {
  if (members) {
    return [members[0],...members[1].map(([,,,member]) => member)].reduce((object, [key, value]) => {
      return Object.assign(object, { [key]: value })
    }, {})
  } else {
    return {}
  }
}

member = key: string _ ':' _ value: value { return [key, value] }

value = hash / array / string / number / true / false / null

string = '"' chars:[^"]* '"' { return chars.join('') }

number = negated: '-'? wholes: [0-9]+ decimals: ('.'[0-9]+)? {
  return parseFloat((negated || '') + wholes.join('') + (decimals ? decimals.join('') : ''))
}

array = '[' _ values: (value (_','_ value)*)? _ ']' {
  if (values) {
    return [values[0], ...values[1].map(([,,,value]) => value)]
  } else {
    return []
  }
}

true = 'true' { return true }

false = 'false' { return false }

null = 'null' { return null }

_ = [ \t\r\n]*
