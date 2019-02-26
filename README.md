# PaTables

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Can't find an easy way to organize your table data without sacrificing all the design?  Neither could we. Introducing PaTables, a react render prop library that empowers you to handle the look and feel while we take care of the rest. PaTables is small performant library that fits nicely into any react project. 

## Docs
* [The Installation]()
* [The Basics]()
* [The API]()
* [The Notes]()
* [Get Help]()

## The Installation
You can install PaTables with either NPM or Yarn

### NPM
```
$ npm install --save patables
```
### Yarn
```
$ yarn add patables
```

## The Basics

```js
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Search from './Search'
import { Patables, Pagination } from 'patables'

class Users extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: []
    }
  }

  componentDidMount() {
    this.props.startGetUsers()
  }

  render() {
    const renderTable = (props) => {
      return (
        <div>
          <table className='table table-hover mb-4'>
            <thead className='bg-primary text-white'>
              <tr>
                <th name='firstName' onClick={props.setColumnSortToggle}>FirstName</th>
                <th name='lastName' onClick={props.setColumnSortToggle}>LastName</th>
                <th name='dob' onClick={props.setColumnSortToggle}>Date Of Birth</th>
                <th name='occupation' onClick={props.setColumnSortToggle}>Occupation</th>
              </tr>
            </thead>
            <tbody>
              {props.visibleData.map((user, i) => {
                return (
                  <tr key={i}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.dob}</td>
                    <td>{user.occupation}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <Pagination
            prevDisabled={props.prevDisabled}
            nextDisabled={props.nextDisabled}
            pageNumber={props.currentPage}
            paginationButtons={props.paginationButtons}
            setPageNumber={props.setPageNumber} />
        </div>
      )
    }

    return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
            <h1>Assets</h1>
            <hr className='mb-4' />
            <Search />

            <Patables
                renderTable={renderTable}
                initialData={this.state.users}
                resultSet={10}
                sortColumn='firstName' />
          </div>
        </div>
      </div>
    )
  }
}

export default Users

```

## The API


## The Notes


## Get Help




