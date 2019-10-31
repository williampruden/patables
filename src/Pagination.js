import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Pagination extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return this.props.paginationButtons.length <= 1
      ? (
        <ul className='pagination rounded-flat pagination-primary d-flex justify-content-center invisible'>
        </ul>
      ) : (
        <ul className='pagination rounded-flat pagination-primary d-flex justify-content-center'>
          <li
            className={this.props.prevDisabled ? 'page-item invisible' : 'page-item'}
            onClick={() => { this.props.setPageNumber(1) }}>
            <a className='page-link' aria-label='Next'>
              <span aria-hidden='true'>1</span>
              <span className='sr-only'>1</span>
            </a>
          </li>
          <li
            className={this.props.prevDisabled ? 'page-item invisible' : 'page-item'}
            onClick={() => { this.props.setPageNumber(this.props.pageNumber - 1) }}>
            <a className='page-link' aria-label='Next'>
              <span aria-hidden='true'>&laquo;</span>
              <span className='sr-only'>Previous</span>
            </a>
          </li>

          {
            this.props.paginationButtons.map((page, i) => {
              return (
                <li key={i} className={this.props.pageNumber === page ? 'page-item active' : 'page-item'}>
                  <span className='page-link pointer' onClick={() => { this.props.setPageNumber(page) }}>{page}</span>
                </li>
              )
            })
          }

          {/*  page shows first and last page at Pagination */}
          <li
            className={this.props.nextDisabled ? 'page-item invisible' : 'page-item'}
            onClick={() => {
              !this.props.nextDisabled
                ? this.props.setPageNumber(this.props.pageNumber + 1)
                : console.log('page ended!')
            }}>
            <a className='page-link' aria-label='Next'>
              <span aria-hidden='true'>&raquo;</span>
              <span className='sr-only'>Next</span>
            </a>
          </li>
          <li
            className={this.props.nextDisabled ? 'page-item invisible' : 'page-item'}
            onClick={() => { this.props.setPageNumber(this.props.totalPage) }}>
            <a className='page-link' aria-label='Next'>
              <span aria-hidden='true'>{this.props.totalPage}</span>
              <span className='sr-only'>{this.props.totalPage}</span>
            </a>
          </li>
        </ul>
      )
  }
}

Pagination.propTypes = {
  totalPage: PropTypes.number,
  prevDisabled: PropTypes.bool,
  nextDisabled: PropTypes.bool,
  setPageNumber: PropTypes.func,
  pageNumber: PropTypes.number,
  paginationButtons: PropTypes.array
}
