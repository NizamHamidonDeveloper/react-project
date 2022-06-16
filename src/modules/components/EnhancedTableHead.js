import React from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import Checkbox from '@material-ui/core/Checkbox';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

export default function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells, control, collapse } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    const renderTableCell = () => {
        if(control){
            return (<TableCell aria-hidden style={{padding: 3}}  padding={'none'} align={'right'}>
                
            </TableCell>)
        }

        else if(collapse){
            return (<TableCell aria-hidden style={{padding: 3}}  padding={'none'} align={'right'}>
                
            </TableCell>)
        }
    }

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                <Checkbox
                    style={{ display: props.listOnly ? "none": "normal"}}
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={rowCount > 0 && numSelected === rowCount}
                    onChange={onSelectAllClick}
                    inputProps={{ 'aria-label': 'select all' }}
                />
                </TableCell>
                {headCells ? headCells.map((headCell) => (
                <TableCell
                    style={{padding: 3}}
                    key={headCell.id}
                    align={'left'}
                    padding={headCell.disablePadding ? 'none' : 'default'}
                    sortDirection={orderBy === headCell.id ? order : false}
                >
                    <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
                    >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                        <span className={classes.visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </span>
                    ) : null}
                    </TableSortLabel>
                </TableCell>
                )):null}
                
               {renderTableCell()}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};