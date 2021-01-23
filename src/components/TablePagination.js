import React, { Component } from 'react';

class TablePagination extends Component {
    onClickPage = page => {
        const recordStartIndex = this.props.recordsPerPage * (page-1);
        const activePage = page;
        this.props.setPage(recordStartIndex, activePage);
    }

    onClickPagePrev = () => {
        let page = this.props.activePage;
        if(page !== 1) page--;
        this.onClickPage(page);
    }

    onClickPageNext = noOfPages => {
        let page = this.props.activePage;
        if(page !== noOfPages) page++;
        this.onClickPage(page);
    }

    renderPagination = (totalRecords) => {
        let pages = [];   
        const noOfPages = Math.ceil(totalRecords / this.props.recordsPerPage);
        const indexPage = this.props.activePage > 2 ? 
        this.props.activePage + 1 >= noOfPages ? 
        noOfPages > 5 ? noOfPages - 4 : 1 : this.props.activePage - 2 : 1
        const stopPage = noOfPages <= indexPage + 4 ? noOfPages : indexPage + 4

        for(var i = indexPage; i <= stopPage; i++){
            const page = i;
            pages.push(
                <button key={page} className={this.getPageClasses(page)}
                onClick={() => this.onClickPage(page)}>{page}</button>
            )
        }

        return(
            <div className="btn-toolbar justify-content-end" role="toolbar">
                <div className="btn-group" role="group">
                    <button className={this.getPrevPageClasses()}
                    onClick={() => this.onClickPagePrev()}>
                        <i className="fa fa-long-arrow-alt-left"></i>
                        <span className="d-none d-sm-inline ml-1">Prev</span>
                    </button>
                    { this.renderBackPage(indexPage, 1) }
                    { [pages] }
                    { this.renderContinuePage(stopPage, noOfPages) }
                    <button className={this.getNextPageClasses(noOfPages)}
                    onClick={() => this.onClickPageNext(noOfPages)}>
                        <i className="fa fa-long-arrow-alt-right"></i>
                        <span className="d-none d-sm-inline ml-1">Next</span>
                    </button>
                </div>
            </div>
        );
    }

    renderBackPage = (indexPage, pageLowerLimit) => {
        if(indexPage > pageLowerLimit) {
            const pageNo = indexPage - 1;
            return (
                <button key={pageNo} className={this.getPageClasses(pageNo)}
                onClick={() => this.onClickPage(pageNo)}>...</button>
            );
        }
    }

    renderContinuePage = (stopPage, pageUpperLimit) => {
        if(stopPage < pageUpperLimit) {
            const pageNo = stopPage + 1;
            return (
                <button key={pageNo} className={this.getPageClasses(pageNo)}
                onClick={() => this.onClickPage(pageNo)}>...</button>
            );
        }
    }

    getPageClasses = page => {
        let classes = "btn pagination-nav ";
        classes+= page === this.props.activePage ? "btn-outline-primary-active" : "btn-outline-primary"
        return classes;
    }

    getPrevPageClasses = () => {
        let classes = "btn ";
        classes+= this.props.activePage === 1 ? "pagination-disabled" : "btn-outline-primary pagination-nav"
        return classes;
    }

    getNextPageClasses = noOfPages => {
        let classes = "btn ";
        classes+= this.props.activePage === noOfPages ? "pagination-disabled" : "btn-outline-primary pagination-nav"
        return classes;
    }

    render() { 
        const { totalRecords } = this.props;
        return (this.renderPagination(totalRecords));
    }
}
 
export default TablePagination;