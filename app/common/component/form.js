

import React, {Component} from 'react'
const FieldsContext = React.createContext('fields')
export function withFields() {


  return Target => {
    class FieldValueCollector extends Component{

      constructor(props){
        super()
        this.values = props.defaultValues || {}
        this.notifies = {}
      }
      handleEmitChange = ({name, value}) => {
        this.values[name] = value
        this.props.onChange && this.props.onChange(this.getFieldValues())
      }


      getFieldValues = () => {
        return this.values
      }
      render(){
        return (
          <FieldsContext.Provider value={{
            emitChange : this.handleEmitChange,
            registerNotifier : (name, handler) => {
              this.notifies[name] = handler
              return () => {
                delete this.notifies[name]
              }
            },
            values : this.values
          }}>
            <Target {...this.props}
              getFieldValues={this.getFieldValues}
              setValues={data => {
                this.values = data
                Object.keys(data).forEach(key => {
                  if(this.notifies[key]) {
                    this.notifies[key](data[key])
                  }
                })
              }}
            />
          </FieldsContext.Provider>
        )
      }
    }
    return FieldValueCollector
  }

}

export class Field extends Component  {

  static contextType = FieldsContext

  constructor(props) {
    super()
    this.state = {
      value : undefined
    }
  }

  componentWillMount(){
    this.setState({
      value : this.context.values[this.props.name]
    })
    this.removeNotifier = this.context.registerNotifier(this.props.name, this.notifierHandler)
  }

  componentWillUnmount(){
    this.removeNotifier
  }

  notifierHandler = (value) => {
    this.setState({
      value
    })

  }


  changeHandler = (e) => {
    let value = e
    if(typeof e === 'object' && e.target) {
      value = e.target.value
    }
    this.setState({
      value
    }, () => {
      this.context.emitChange({
        name : this.props.name,
        value
      })
      this.props.children.onChange &&
        this.props.children.onChange(e)
    })
  }

  render() {
    return <div className='field'>{this.props.children && React.cloneElement(this.props.children, {
      value: this.state.value,
      ref: r => this.r = r,
      onChange: this.changeHandler

    })
    }</div>
  }
}


