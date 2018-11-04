const sqlFormatter = require('sql-formatter')
/**
 * 创建表和维护表
 */
class Database{

  constructor(){
    this.indexes = []
    this.columns = []
    this.data = []
  }

  addColumn(table, col, type, comment, options = {}){
    const def = {
      nullable : false
    }
    options = {...def, ...options}
    this.columns.push({
      table,
      comment,
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

  addData(table, row){
    this.data.push({
      table,
      row
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
          const def = col.default !== undefined ? 'default ' + col.default : ''
          const comment = col.comment ? `COMMENT '${col.comment}'` : ''
          return `\`${col.name}\` ${col.type} ${nul} ${def} ${incre} ${comment}`
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
      const name = columns.join('_')
      const expr = columns.map(column => {
        return `\`${column}\``
      }).join(',')
      if (type === 'index') {
        return `ALTER TABLE ${table} ADD INDEX \`idx_${name}\` (${expr});`
      } else {
        return `ALTER TABLE ${table} ADD CONSTRAINT \`cst_${name}\` UNIQUE KEY (${expr});`
      }
    }).join('\n')

    const dataSql = this.data.map ( ({table, row}) => {
      const columns = Object.keys(row).map(col => {
        return `\`${col}\``
      }).join(',')
      const values = Object.keys(row).map(col => {
        const val = row[col]
        if(typeof val === 'string') {
          return `'${val}'`
        }
        return val
      }).join(',')
      return `insert into ${table} (${columns}) values (${values});\n`
    }).join('\n')
    return sqls.join('\n\n') + '\n\n' + indexSql + '\n\n' + dataSql
  }
}

module.exports = Database