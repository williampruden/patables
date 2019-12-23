# PaTables (Async)
Can't find an easy way to organize your table data without sacrificing all the design?  Neither could we. Introducing PaTables, a react render prop library that empowers you to handle the look and feel while we take care of the rest. PaTables is a small performant library that fits nicely into any React project. 

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
                <th name='dob'>Date Of Birth</th>
                <th name='occupation'>Occupation</th>
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
              pageParam={['page', 1]}
              limitParam={['limit', 5]}
              sortParam={['order_by', 'desc']}
              orderByParam={['sort_by', 'firstName']}
              searchParam={['query_term', '']} 
              url='https://myAPI.com/api/v1/users' 
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
|apiKey           |Array    	  |['api_key', 'a1b2c3']                  |         |          |
|config           |Object     	|{ headers: { key: 'value' } }          |         |          |
|pageNeighbors    |Number     	|3         	                            |2        |          |
|orderByParam     |Array        |['order_by', 'desc']                   |         |          |
|sortParam        |Array      	|['sort_by', 'rating']                  |         |          |
|searchParam      |Array      	|['query_term', 'foo']                  |         |          |
|pageParam        |Array        |['page_number', 1]                     |         |          |
|limitParam       |Array        |['limit', 5]                           |         |          |
|customParam      |Array      	|[{ param: 'foo', value: 'bar' }]       |         |          |
|pathToData       |Array      	|['data', 'users']                      |         |          |
|pathToPageTotal  |Array      	|['data', 'page_total']                 |         |          |
|showURI          |String      	|`true`                                 |         |          |
 

#### render
Render takes a function that returns the JSX you wish to render. This function is passed a set of methods and values in the form of "props" that you will use to help build your table. To learn more about these "props," skip ahead to the next section to explore what's available.

```js
<PatablesAsync
  url='https://myAPI.com/api/v1/users'
  render={(props) => {
    return (
      // your table here
    )
  }} />
```


#### url, apiKey, config
The `url` is what PatablesAsync uses to make API calls for new data. `apiKey` is an array where the first value is the API key param and the second value is the API key. `config` is an object where you can specify HTTP headers and their values.

The final response is stored as `visibleData` within PatablesAsync and is included in the props for your table. PatablesAsync is prompted by updates, fetches your data, and only causes a re-render when it detects new information.

```js
<PatablesAsync
  apiKey={['api_key','a1b2c3']}
  config={{ 
    headers: {
        Accept: 'application/json'
      }
  }}
  url='https://myAPI.com/api/v1/users'
  render={(props) => {
    return (
      // your table here, where you can render data from props.visibleData
    )
  }}/>
```
URI becomes `https://myAPI.com/api/v1/users?apiKey=a1b2c3`


#### pageNeighbors
PatablesAsync will provide to you the pagination logic for your tables. Here is your opportunity to specify how many pages you wish to show up in that pagination array. Some examples:

```js
<PatablesAsync
  pageNeighbors={1} // will give you: [1, 2, 3]
  url='https://myAPI.com/api/v1/users'
  render={(props) => {
    return (
      // your table here
    )
  }} /> 

<PatablesAsync
  pageNeighbors={2} // will give you: [1, 2, 3, 4, 5]
  url='https://myAPI.com/api/v1/users'
  render={(props) => {
    return (
      // your table here
    )
  }} /> 

<PatablesAsync
  pageNeighbors={3} // will give you: [1, 2, 3, 4, 5, 6, 7]
  url='https://myAPI.com/api/v1/users'
  render={(props) => {
    return (
      // your table here
    )
  }} /> 
```


#### orderByParam
This is an array where the first value is the sort order query param and the second value is the sort order (either 'asc' or 'desc'). You will be given a method in the next section called `setColumnSortToggle` that will allow you to toggle the sort order and potentially update the value you wish to sort by.

```js
<PatablesAsync
  orderByParam={['order_by', 'desc']} // will sort your data in descending order
  url='https://myAPI.com/api/v1/users'
  render={(props) => {
    return (
      // your table here
    )
  }} />
```
URI becomes `https://myAPI.com/api/v1/users?order_by=desc`


#### sortParam
This is an array where the first value is the sort by query param and the second value is what to sort by (ex: popularity, relevancy, title, year). You will be given a method in the next section called `setColumnSortToggle` that will allow you to update the value you wish to sort by and toggle the sort order.

```js
<PatablesAsync
  sortParam={['sort_by', 'firstName']} // will sort the table by firstName
  url='https://myAPI.com/api/v1/users'
  render={(props) => {
    return (
      // your table here
    )
  }} />

visibleData = [
  {
    firstName: 'Dwight',
    lastName: 'Schrute'
  },
  {
    firstName: 'Jim',
    lastName: 'Halpert'
  }
]
```
URI becomes `https://myAPI.com/api/v1/users?sort_by=firstName`


#### searchParam
This is an array where the first value is the search query param and the second value is the search term itself (you should pass in an empty string for this value if you want the search term to be empty initially).  You will be given a method in the next section called `setSearchTerm` that will allow you to update the search term and fetch fresh results.

```js
<PatablesAsync
  searchParam={['query_term', 'foo']} 
  url='https://myAPI.com/api/v1/users'
  render={(props) => {
    return (
      // your table here
    )
  }} />
```
URI becomes `https://myAPI.com/api/v1/users?query_term=foo`


#### pageParam
This is an array where the first value is the page number query param and the second value is the page you want your results to start on. You will be given a method in the next section called `setPageNumber` that will allow you to change to another page number.

```js
<PatablesAsync
  pageParam={['page_number', 1]} // will return results starting on page 1
  url='https://myAPI.com/api/v1/users'
  render={(props) => {
    return (
      // your table here
    )
  }} />
```
URI becomes `https://myAPI.com/api/v1/users?page_number=1`


#### limitParam
This is an array where the first value is the limit query param and the second value is the number of items you want to display on the screen. You will be given a method in the next section called `setResultSet` that will allow you to change the number of results you get back.

```js
<PatablesAsync
  limitParam={['limit', 10]} // will return 10 items per page
  url='https://myAPI.com/api/v1/users'
  render={(props) => {
    return (
      // your table here
    )
  }} /> 
```
URI becomes `https://myAPI.com/api/v1/users?limit=10`


#### customParam
If you have additional query params you'd like to include in the URI, use the format below. Note that these values cannot be changed from their original definition, since there are no methods/handlers to change them.

```js
<PatablesAsync
  customParam={[
    { param: 'foo', value: 'abc' },
    { param: 'bar', value: 123 } 
  ]}
  url='https://myAPI.com/api/v1/users'
  render={(props) => {
    return (
      // your table here
    )
  }} /> 
```
URI becomes `https://myAPI.com/api/v1/users?foo=abc&bar=123`


#### pathToData, pathToPageTotal
If the data you want is nested in an object, use an array of strings to specify the path to the data. Otherwise, you can omit this prop and PatablesAsync will directly set the response object as the `visibleData` coming back.

If the page total number you want is nested in an object, use an array of strings to specify the path to the number. Otherwise, you can omit this prop and PatablesAsync will set the total pages to 1 (ie. pagination is disabled).

```js
<PatablesAsync
  url='https://myAPI.com/api/v1/users'
  pathToData={['data']}
  pathToPageTotal={['page_total']}
  render={(props) => {
    return (
      // your table here
    )
  }} /> 

// The above props will enable PatablesAsync to properly access data and page total in this response object:
response = {
  status: 'success',
  data: [
    {
      firstName: 'Jim',
      lastName: 'Halpert'
    },
    {
      firstName: 'Dwight',
      lastName: 'Schrute'
    }
  ],
  page_total: 10
}
```
                
#### showURI
This is a boolean value that allows you to console.log the URI that PatablesAsync is using in any given API call.  This is helpful for debugging during development to ensure that you are passing in the query params and values that you expect.

```js
<PatablesAsync
  url='https://myAPI.com/api/v1/users'
  searchParam={['query_term', 'foo']} 
  showURI
  render={(props) => {
    return (
      // your table here
    )
  }} /> 
```
Console logs out the message: The URI is: `https://myAPI.com/api/v1/users?query_term=foo`

## The "props"
The render function as we learned in the previous section is handed a set of methods and values in the form of "props". These props are tools you can use within your JSX to make your life easier. Lets take a look at what you're given.

|Props                |Type   	    |
|---	                |---	        |
|currentPage          |Number       |
|nextDisabled         |Boolean    	|
|pageNeighbors        |Number      	|
|paginationButtons    |Array      	|
|prevDisabled         |Boolean    	|
|resultSet            |Number      	|
|search               |String       |
|setSearchTerm        |Function     |
|clearSearch          |Function     |
|setColumnSortToggle  |Function    	|
|setPageNumber        |Function    	|
|setResultSet         |Function     |
|sortColumn           |String      	|
|sortOrder            |String      	|
|totalPages           |Number      	|
|visibleData          |Array      	|
|isLoading            |Boolean      |

#### currentPage
currentPage is the active (or current) page number that the user is on. Great for applying the active class in pagination.

```js
{props.paginationButtons.map((page, i) => {
  return (
    <li key={i} className={props.currentPage === page ? 'page-item active' : 'page-item'}>
      <span className='page-link pointer' onClick={() => { props.setPageNumber(page) }}>{page}</span>
    </li>
  )
})}
```

#### nextDisabled / prevDisabled
In pagination, it's common to have next / previous buttons. `nextDisabled` and `prevDisabled` lets you know if your next or previous buttons ought to be disabled or made invisible as you'll see in my example below.

```js
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
```


#### pageNeighbors
pageNeighbors defaults to 2 but you can set pageNeighbors when creating your instance of `<PatablesAsync />`. It allows you to specify how many page buttons you wish to see to the left and right of your active page. This value will directly influence the length of your [paginationButtons](#paginationbuttons).


#### paginationButtons
paginationButtons is an array of the page numbers you need to display in your pagination. A few examples above show how we `.map()` over this array to create our pagination.


#### resultSet
resultSet is how many items will be returned in our [visibleData](#visibledata) array. The default value is whatever your API wants to send.  You can pass in a new value with the `limitParam` array: `<PatablesAsync limitParam={['limit', '5']}>`.


#### setResultSet
Sometimes you want to give your user the flexibility of setting how many results they wish to see in a given table. This method allows you to give them the ability to do just that. You'll need to have a limitParam array for this method to work.

```js
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
```


#### search / setSearchTerm
These two go hand in hand as `setSearchTerm` will be the method you use to set the value for `search`.  Both of these values will be passed back in props and can be used like this in your `renderTable` method:

```js
<div className='form-row mb-3'>
  <input
    className='form-control'
    placeholder='Search...'
    value={props.search}
    onChange={props.setSearchTerm}/>
</div>
```

#### submitSearch / clearSearch
Use the `submitSearch` method to kick off an API call to fetch your results based on your `search` value.  The `clearSearch` method will set the `search` value as an empty string inside your `searchParam` array and reset `currentPage` to 1. You can use this method to reset the `search` value to an empty string, and the API will automatically re-fetch the results.

```js
<div className='form-row mb-3'>
  <input
    className="form-control col-5"
    placeholder="Search..."
    value={props.search}
    onChange={props.setSearchTerm}
  />
  <button onClick={props.submitSearch}>Submit</button>
  <button onClick={props.clearSearch}>Reset</button>
</div>
```


#### sortOrder
If you wish to show your user in which direction the column is being sorted this value is being passed back to you so you can manage your css accordingly.

#### sortColumn
If you wish to show your user which column is being sorted this value is being passed back to you so you can manage your css accordingly.


#### setColumnSortToggle
Sorting a table by its columns is a common action a user expects to take. This method allows you set a `name` attribute on the `<th />` tag that is equal to value you wish to sort by for `sortParam` (ex: firstName).  Internally, PatablesAsync will fetch fresh results using your sortColumn AND sortOrder values (ex: sorting firstName in ascending order).  If you click repeatedly on a column, this method toggles between 'asc' and 'desc' orders.

```js
let data = [
  {
    firstName: 'Michael',
    lastName: 'Scott',
    dob: '03-15-1964',
    occupation: 'The Boss',
  }
]

<thead className='bg-primary text-white'>
  <tr>
    <th name='firstName' onClick={props.setColumnSortToggle}>FirstName</th>
    <th name='lastName' onClick={props.setColumnSortToggle}>LastName</th>
    <th name='dob' >Date Of Birth</th>
    <th name='occupation' >Occupation</th>
  </tr>
</thead>
```


#### setPageNumber
This method allows you to set a new `currentPage` within your pagination. Examples of this method can be found above.


#### totalPages
totalPages comes from your API or defaults to 1 (which disables pagination). If you wish to tell your user how many pages they potentially need to paginate through then this is your value.


#### visibleData
`visibleData` is the data you will want to render onto the screen. This data has gone through all of the sorting and filtering via your API.

```js
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
```

#### isLoading
`isLoading` is a boolean value indicating whether the `<PatablesAsync>` is currently loading content. It's default to `false`. When you make a request with `<PatablesAsync>`, it becomes `true` until the request is completed. Use this to render a loading screen.
