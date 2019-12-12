# PaTables (Async)
Can't find an easy way to organize your table data without sacrificing all the design?  Neither could we. Introducing PaTables, a react render prop library that empowers you to handle the look and feel while we take care of the rest. PaTables is small performant library that fits nicely into any React project. 

The **PatablesAsync** component allows server side pagination and requires you to pass PatablesAsync your API signature.  Alternatively, with [Patables](README.md), you can fetch and pass in all your initial data up front and let Patables handle the manipulation. 

## Docs
* [The Install](#the-install)
* [The Basics](#the-basics)
* [The API](#the-api)
* [The "props"](#the-props)


## The Install
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
import axios from 'axios'
import { PatablesAsync } from 'patables'

class Users extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const renderTable = (props) => {
      return (
        <div>
          <div className='form-row mb-3'>
            <input
              className='form-control'
              placeholder='Search...'
              value={props.search}
              onChange={props.setSearchTerm}/>
          </div>
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

          <div className='row my-4 justify-content-between'>
            <div className='col-md-6'>
              <div className='form-inline'>
                <label className='my-1 mr-2'>Result set: </label>
                <select
                  className='form-control'
                  value={props.resultSet}
                  onChange={(e) => { props.setResultSet(parseInt(e.target.value)) }}>
                  <option>5</option>
                  <option>10</option>
                  <option>15</option>
                </select>
              </div>
            </div>

            <div className='col-md-6'>
              <ul className='pagination rounded-flat pagination-primary d-flex justify-content-center'>
                <li
                  className={props.prevDisabled ? 'page-item invisible' : 'page-item'}
                  onClick={() => { props.setPageNumber(props.currentPage - 1) }}>
                  <a className='page-link' aria-label='Next'>
                    <span aria-hidden='true'>&laquo;</span>
                    <span className='sr-only'>Previous</span>
                  </a>
                </li>

                {props.paginationButtons.map((page, i) => {
                  return (
                    <li key={i} className={props.currentPage === page ? 'page-item active' : 'page-item'}>
                      <span className='page-link pointer' onClick={() => { props.setPageNumber(page) }}>{page}</span>
                    </li>
                  )
                })}

                <li
                  className={props.nextDisabled ? 'page-item invisible' : 'page-item'}
                  onClick={() => { props.setPageNumber(props.currentPage + 1) }}>
                  <a className='page-link' aria-label='Next'>
                    <span aria-hidden='true'>&raquo;</span>
                    <span className='sr-only'>Next</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className='container mt-5'>
        <div className='row'>
          <div className='col-md-12'>
            <h1>Users</h1>

            <hr className='mb-4' />
                        
            <PatablesAysnc
              render={renderTable}
              resultSet={5}
              sortColumn='firstName'
              sortParam={['order_by', 'desc']}
              searchParam={['query_term', 'foo']} 
              url={`https://myAPI.com/api/v1/users`}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Users
```


## The API
|Prop             |Type   	    |Example   	                            |Default  |Required  |
|---	            |---	        |---	                                  |---	    |---       |
|render           |Function     |(props) => {}                          |         |true      |
|url              |String       |`https://myAPI.com/api/v1/resource`    |         |true      |
|apiKey           |Array    	  |['api_key_', 'a1b2c3']                 |         |          |
|config           |Object     	|{ headers: { key: 'value' } }          |         |          |
|pageNeighbors    |Number     	|3         	                            |2        |          |
|sortColumn       |String     	|'firstName'                            |         |          |
|orderByParam     |Array        |['order_by', 'desc']                   |'asc'    |          |
|sortParam        |Array      	|['sort_by_', 'rating']                 |         |          |
|searchParam      |Array      	|['query_term', 'foo']                  |         |          |
|pageParam        |Array        |['page_number', 2]                     |1        |          |
|limitParam       |Array        |['limit', 5]                           |10       |          |
|customParam      |Array      	|[{ param: 'foo', value: 'bar' }]       |         |          |
|pathToData       |Array      	|['data', 'users']                      |         |          |
|pathToPageTotal  |Array      	|['data', 'data', 'user_count']         |         |          |


#### render
Render takes a function that returns the JSX you wish to render onto the bag. This function is passed a set of methods and values in the form of "props" that you will use to help build your table. To learn more about these "props" skip ahead to the next section to explore what's available.

```js
<PatablesAync
  url={`https://myAPI.com/api/v1/users`}
  render={(props) => {
    return (
      // your table here
    )
  }} />
```


#### url, apiKey, config
The `url` is what PatablesAsync uses to make API calls for new data. `apiKey` is an array where the first value is the API key param and the second value is the API key. `config` is an object where you can specify headers and their values.

The final response is stored in the `visibleData` array and included in the props for your table. PatablesAsync is prompted by updates, fetches your data, and only causes a re-render when it detects new information.

```js
  <PatablesAync
    apiKey={['api_key','a1b2c3']}
    config={{ 
      headers: {
          Accept: 'application/json'
        }
    }}
    url={`https://myAPI.com/api/v1/users`}
    render={(props) => {
      return (
        // your table here, where you can render data from props.visibleData array
    )
  />
```


#### pageNeighbors
PatablesAsync will provide to you the pagination logic for your tables. Here is your opportunity to specify how many pages you wish to show up in that pagination array. Some examples:

```js
<PatablesAsync
  pageNeighbors={1} // will give you: [1, 2, 3]
  url={`https://myAPI.com/api/v1/users`}
  render={(props) => {
    return (
      // your table here
    )
  }} /> 

<PatablesAsync
  pageNeighbors={2} // will give you: [1, 2, 3, 4, 5]
  url={`https://myAPI.com/api/v1/users`}
  render={(props) => {
    return (
      // your table here
    )
  }} /> 

<PatablesAsync
  pageNeighbors={3} // will give you: [1, 2, 3, 4, 5, 6, 7]
  url={`https://myAPI.com/api/v1/users`}
  render={(props) => {
    return (
      // your table here
    )
  }} /> 
```


#### sortColumn
If you know in advance what column you wish to order and sort your data on, then you can pass that information along here. Just tell PatablesAsync what `key` you wish to sort with. This 

```js
visibleData = [
  {
    firstName: 'Jim',
    lastName: 'Halpert'
  },
  {
    firstName: 'Dwight',
    lastName: 'Schrute'
  }
]

<PatablesAsync
  sortColumn='firstName'
  url={`https://myAPI.com/api/v1/users`}
  render={(props) => {
    return (
      // your table here, will be sorted alphabetically by first name
    )
  }} />
```


#### orderByParam
Sort order defaults to `asc` (ascending order) but can be overriden with `orderByParam`. This is an array where the first value is the sort order query param and the second value is the sort order. You can omit this second value or explicitly set it to `desc`. You will be given a method in the next section called `setColumnSortToggle` that will allow you to update the column you wish to order AND sort by.

```js
<PatablesAsync
  orderByParam={['order_by', 'desc']}
  sortColumn='firstName'
  url={`https://myAPI.com/api/v1/users`}
  render={(props) => {
    return (
      // your table here
    )
  }} />
```
URI becomes `https://myAPI.com/api/v1/users?order_by=desc`


#### sortParam
This is an array where the first value is the sorting query param and the second value is the value.  You will be given a method in the next section called `setColumnSortToggle` that will allow you to update the column you wish to order AND sort by.

```js
<PatablesAsync
  sortParam={['sort_by', 'rating']}
  url={`https://myAPI.com/api/v1/users`}
  render={(props) => {
    return (
      // your table here
    )
  }} /> 
```
URI becomes `https://myAPI.com/api/v1/users?sort_by=rating`


#### searchParam
This is an array where the first value is the search query param and the second value is the search term itself.  You will be given a method in the next section called `setSearchTerm` that will allow you to update the search term and fetch fresh results.

```js
<PatablesAync
  searchParam={['query_term', 'foo']} 
  url={`https://myAPI.com/api/v1/users`}
  render={(props) => {
    return (
      // your table here
    )
  }} />
```
URI becomes `https://myAPI.com/api/v1/users?query_term=foo`


#### pageParam
If for some reason you don't want the table to start on the first page of results, you can specify the starting page here. Defaults to page 1.

```js
<PatablesAsync
  pageParam={['page_number', 3]}
  url={`https://myAPI.com/api/v1/users`}
  render={(props) => {
    return (
      // your table here
    )
  }} />
```


#### limitParam
By default, PatablesAsync will return a result set that contains the first 10 items in its visibleData array for you to display on the screen.  If you would like to change the default setting, just pass your desired value into `limitParam`.

```js
<PatablesAsync
  limitParam={['limit', 20]} // Patables will now return 20 items per page.
  url={`https://myAPI.com/api/v1/users`}
  render={(props) => {
    return (
      // your table here
    )
  }} /> 
```


#### customParam


#### pathToData


#### pathToPageTotal

