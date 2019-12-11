import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isFunction, uriBuilder } from './utils/helpers'
import axios from 'axios'

export default class PatablesAsync extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visibleData: [],
      search: '',
      currentPage: this.props.startingPage || 1,
      resultSet: this.props.resultSet || 5,
      totalPages: 1,
    }
  }

  componentDidMount() {
    this.getVisibleData()
  }

  getVisibleData = () => {
    let uri = this.props.url

    if (this.props.pageParam) {
      uri = uriBuilder(uri, this.props.pageParam, this.state.currentPage)
    }
    if (this.props.limitParam) {
      uri = uriBuilder(uri, this.props.limitParam, this.state.resultSet)
    }
    if (this.props.searchParam) {
      uri = uriBuilder(uri, this.props.searchParam[0], !this.state.search ? this.props.searchParam[1] : this.state.search)
    }

    axios.get(uri, this.props.config)
      .then(response => {
        let finalData = { ...response }
        this.props.pathToData && this.props.pathToData.forEach(key => {
          finalData = finalData[key]
        })

        let finalPageTotal = { ...response }
        if (this.props.pathToPageTotal) { 
          this.props.pathToPageTotal.forEach(key => {
            finalPageTotal = finalPageTotal[key]
          })
        }

        this.setState({
          visibleData: finalData,
          totalPages: typeof finalPageTotal !== 'number' ? 1 : finalPageTotal
        })
      })
      .catch(err => {
        console.error('error:', err)
      })
  }

  // SEARCH BOX
  setSearchTerm = (e) => {
    let search = e.target.value
    this.setState(() => ({ search }))
  }

  submitSearch = () => {
    if (this.state.search && this.props.searchParam) {
      this.setState({ currentPage: 1 }, this.getVisibleData)
    } else {
      console.warn('Warning🚨: Cannot search without searchParam.')
    }
  }

  clearSearch = () => {
    this.setState({
      search: '',
      currentPage: 1
    }, this.getVisibleData)
  }

  // CURRENT PAGE
  setPageNumber = (currentPage) => {
    this.setState(() => ({ currentPage }), this.getVisibleData)
  }

  // RESULT SET AKA LIMIT
  setResultSet = (value) => {
    let resultSet = value

    if (typeof resultSet === 'string') {
      resultSet = parseInt(resultSet)
    }

    this.setState({ currentPage: 1, resultSet }, this.getVisibleData)
  }


  // CREATING PROPS
  getRenderProps = () => {
    return {
      ...this.state,
      setPageNumber: this.setPageNumber,
      setResultSet: this.setResultSet,
      setSearchTerm: this.setSearchTerm,
      submitSearch: this.submitSearch,
      clearSearch: this.clearSearch,
    }
  }

  render() {
    const { children, render } = this.props
    const renderProps = this.getRenderProps()

    const renderComp = () => {
      if (render && isFunction(render)) {
        return render(renderProps)
      } else if (children && isFunction(children)) {
        return children(renderProps)
      } else {
        console.warn('Please provide a valid render prop or child.')
        return undefined
      }
    }

    return (
      <div>
        {renderComp()}
      </div>
    )
  }
}

PatablesAsync.propTypes = {
  children: PropTypes.func,
  render: PropTypes.func,
  visibleData: PropTypes.array,
  startingPage: PropTypes.number,
  resultSet: PropTypes.number,
  url: PropTypes.string,
  config: PropTypes.object,
  pageParam: PropTypes.string,
  limitParam: PropTypes.string,
  searchParam: PropTypes.array,
  pathToData: PropTypes.array,
  pathToPageTotal: PropTypes.array
}
