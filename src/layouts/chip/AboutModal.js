import React from 'react'
import { connect } from 'react-redux'
import Icon from 'violet-ui/components/Icon'
import Spin from 'violet-ui/components/Spin'
// import Dialog, { DialogHeader, DialogBody } from '../Dialog'
import styles from './index.m.scss'

class AboutModal extends React.Component {
  handleClose = e => {
    e.preventDefault()
    this.props.dispatch({
      type: 'app/closeAbout'
    })
  }

  render() {
    const { showAbout, aboutinfo } = this.props
    return (
      <Dialog open={showAbout} onClose={this.handleClose}>
        <DialogHeader onClose={this.handleClose}>
          <Icon type="about" />
          关于
        </DialogHeader>
        <DialogBody className={styles['about-panel']}>
          <Spin spinning={aboutinfo.loading}>
            <span className={styles['panel-logo']} />
            <h5>网安凌云安全虚拟桌面管理平台V2.1</h5>
            {aboutinfo.data && (
              <ul>
                <li>
                  <span className={styles.title}>系统编号 :</span>{' '}
                  <span>{aboutinfo.data.systemNumber}</span>
                </li>
                <li>
                  <span className={styles.title}>产品类型 :</span>{' '}
                  <span>{aboutinfo.data.productType}</span>
                </li>
                <li>
                  <span className={styles.title}>许可数量 :</span>{' '}
                  <span>{aboutinfo.data.permitNumber}</span>
                </li>
                <li>
                  <span className={styles.title}>许可证有效期 :</span>{' '}
                  <span>{aboutinfo.data.useTimeLimit}</span>
                </li>
              </ul>
            )}
            <h4>2018 CETC-Cloud (c)</h4>
          </Spin>
        </DialogBody>
      </Dialog>
    )
  }
}

export default connect(({ app, global }) => {
  const { showAbout } = app
  const {
    data: { 'app/aboutinfo': aboutinfo = {} }
  } = global
  return {
    showAbout,
    aboutinfo
  }
})(AboutModal)
