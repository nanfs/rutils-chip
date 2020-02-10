import React from 'react'
import styles from './index.m.scss'

export default function Title(props) {
  const { slot } = props
  return <p className={styles.title}>{slot}</p>
}
