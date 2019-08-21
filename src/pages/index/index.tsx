import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from '../../actions/counter'

import './index.styl'

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
  counter: {
    num: number
  }
}

type PageDispatchProps = {
  add: () => void
  dec: () => void
  asyncAdd: () => any
}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch(add())
  },
  dec () {
    dispatch(minus())
  },
  asyncAdd () {
    dispatch(asyncAdd())
  }
}))
class Index extends Component {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
    config: Config = {
      navigationBarTitleText: '查看'
    }
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }
  componentDidMount () {
    Taro.cloud
      .callFunction({
        name: 'login',
      })
      .then(res => {
        console.log('用户信息', res)
      })
      .catch(console.log)
    this.getDate()
  }

  componentWillUnmount () { 
    console.log('componentWillUnmount')
  }

  componentDidShow () { }

  componentDidHide () { }
  getDate () { // 查询数据库
    const db = Taro.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('counters').where({
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        Taro.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  }
  handleClick () { // 添加数据库
    const db = Taro.cloud.database()
    db.collection('counters').add({
      data: {
        name: '小天',
        month: '6/1',
        age: 18
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        console.log(res)
        Taro.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        Taro.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })  
  }
  state = {
    list: [
      {
        name: '怀怀',
        mouth: '6/1'
      }
    ]
  }
  render () {
    // let items = [{id:1, name:'foo'}, {id:2, name:'bar'}];
    return (
      <View>
        {
          this.state.list.map(function (item, index) {
            return <View className='index' key={index}>
                <View>{item.name}</View>
                <View>{item.mouth}</View>
              </View>
                   
          })
        }
        <View onClick={this.handleClick}>增加</View>
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Index as ComponentClass<PageOwnProps, PageState>
