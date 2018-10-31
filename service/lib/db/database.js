const sqlFormatter = require('sql-formatter')
/**
 * 创建表和维护表
 */
class Database{

  constructor(){
    this.indexes = []
    this.columns = []
  }

  addColumn(table, col, type, options = {}){
    const def = {
      nullable : false
    }
    options = {...def, ...options}
    this.columns.push({
      table,
      name : col,
      type,
      ...options
    })
  }

  addIndex(table, columns, type='index') {
    this.indexes.push({
      table,
      type,
      columns : typeof columns === 'string'  ? [columns] : columns
    })
  }

  toSql() {
    const tbls = []
    this.columns.forEach(column => {
      let tbl = tbls.find(x => x.name === column.table)
      if(!tbl) {
        tbl = {
          name : column.table,
          columns : [{
            table : column.table,
            name : 'id',
            type : 'bigint(20) unsigned',
            auto_increment : true
          }]
        }
        tbls.push(tbl)

      }
      tbl.columns.push(column)
    })

    const sqls = tbls.map(tbl => {
      const columns = tbl.columns
        .map(col => {
          const nul = col.nullable ? 'NULL' : 'NOT NULL'
          const incre = col.auto_increment ? 'AUTO_INCREMENT' : ''
          const def = col.default ? 'default ' + col.default : ''
          return `\`${col.name}\` ${col.type} ${nul} ${def} ${incre}`
        })
      const sql = `
        CREATE TABLE \`${tbl.name}\` (
          ${columns.join(',\n')},
          PRIMARY KEY(\`id\`)
        ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
      `
      return `drop table if exists \`${tbl.name}\`;\n`
      + sqlFormatter.format( sql ) //.replace('PRIMARY KEY', '\n  PRIMARY KEY')
    })

    const indexSql = this.indexes.map( ({table, columns, type}) => {
      const name = columns.join('-')
      const expr = columns.map(column => {
        return `\`${column}\``
      }).join(',')
      if (type === 'index') {
        return `ALTER TABLE ${table} ADD INDEX ${name} (${expr});`
      } else {
        return `ALTER TABLE ${table} ADD CONSTRAINT ${name} UNIQUE KEY (${expr});`
      }
    }).join('\n')
    return sqls.join('\n\n') + '\n\n' + indexSql
  }
}

module.exports = Database