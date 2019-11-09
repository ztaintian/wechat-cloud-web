import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'

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
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }
  componentDidMount() {
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

  componentWillUnmount() {
    console.log('componentWillUnmount')
  }

  componentDidShow() { }

  componentDidHide() { }
  getDate() { // 查询数据库
    const db = Taro.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('counters').where({
    }).get({
      success: res => {
        this.setState({
          list: res.data
        })
      },
      fail: () => {
        Taro.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    })
  }
  handleClick() { // 添加数据库
    const db = Taro.cloud.database()
    db.collection('counters').add({
      data: {
        name: this.state.name,
        sunMonth: this.state.sunMonth,
        moonMonth: this.state.moonMonth
      },
      success: () => {
        // 在返回结果中会包含新创建的记录的 _id
        Taro.showToast({
          title: '添加成功',
        })
        this.setState({
          name: '',
          moonMonth: ''
        })
        this.getDate()
      },
      fail: () => {
        Taro.showToast({
          icon: 'none',
          title: '添加失败'
        })
      }
    })
  }
  delId(id) {
    const db = Taro.cloud.database()
    db.collection("counters").doc(id._id).remove({
      success: () => {
        Taro.showToast({
          icon: 'none',
          title: '删除成功'
        })
        this.getDate()
      },
      fail: () => {
        Taro.showToast({
          icon: 'none',
          title: '删除失败'
        })
      }
    })
  }
  nameChange(e, value) {
    if (value === 'name') {
      this.setState({
        name: e.target.value
      })
    } else if (value === 'sun') {
      this.setState({
        sunMonth: e.target.value
      })
    } else if (value === 'moon') {
      this.setState({
        moonMonth: e.target.value
      })
    }
  }
  state = {
    name: '',
    sunMonth: '',
    moonMonth: '',
    list: [
      {
        name: '',
        sunMonth: '',
        moonMonth: ''
      }
    ]
  }
  render() {
    return (
      <View className="index">
        <View className='content'>
          <View className="title">姓名</View>
          <View className="title">生日</View>
          {/* <View>阳历</View> */}
          <View className="title">操作</View>
        </View>
        {
          this.state.list.map(function (item, index) {
            return <View className='content' key={index}>
              <View>{item.name}</View>
              {/* <View>{item.sunMonth}</View> */}
              <View>{item.moonMonth}</View>
              <View onClick={this.delId.bind(this, item)}>删除</View>
            </View>
          })
        }
        <View className="input" >
          <View>姓名:</View>
          <Input type='text' value={this.state.name} onInput={(e) => this.nameChange(e, 'name')} placeholder='请输入姓名'></Input>
        </View>
        {/* <View className="input">
          <View>生日:</View>
          <Input type='text' value={this.state.sunMonth} onInput={(e) => this.nameChange(e, 'sun')} placeholder='请输入阳历生日'></Input>
        </View> */}
        <View className="input">
          <View>生日:</View>
          <Input type='text' value={this.state.moonMonth} onInput={(e) => this.nameChange(e, 'moon')} placeholder='请输入阴历生日'></Input>
        </View>
        <View className="add" onClick={this.handleClick}>添 加</View>
      </View>
    )
  }
}



export default Index as ComponentClass
