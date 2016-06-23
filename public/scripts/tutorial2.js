var ProductCategoryRow = React.createClass({	
	render: function () {
		return (
			<tr>
				<th>{' '}</th>
				<th>{this.props.category}</th>
				<th>{' '}</th>
			</tr>
		);
	}
});

var ProductRow = React.createClass({
	render: function () {
		var name = this.props.product.stocked ? this.props.product.name : <span style={{color: 'red'}}>{this.props.product.name}</span>;
		return (
			<tr>
		        <td>{name}</td>
		        <th>{' '}</th>
		        <td>{this.props.product.price}</td>
		    </tr>
		);
	}
});

var ProductTable    = React.createClass({
	
	render: function () {
		var rows = [];
    	var lastCategory = null;
	    this.props.products.forEach(function(product) {
	      	if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)) {
	        	return;
	      	}
	      	if (product.category !== lastCategory) {
	        	rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
	      	}
	      	rows.push(<ProductRow product={product} key={product.name} />);
	      	lastCategory = product.category;
	    }.bind(this));
		return (
			<table>
		        <thead>
		          	<tr>
		            	<th>Name</th>
		            	<th>{' '}</th>
		            	<th>Price</th>
		         	 </tr>
		        </thead>
		        <tbody>{rows}</tbody>
	      </table>
		);
	}
});

var SearchBar   = React.createClass({
	handleChange: function() {
    	this.props.onUserInput(
      		this.refs.filterTextInput.value,
      		this.refs.inStockOnlyInput.checked
    	);
  	},
	render: function () {
		return (
			<form>
        		<input type="text" placeholder="Search..." value={this.props.filterText} ref="filterTextInput" onChange={this.handleChange}/>
        		<p>
          			<input type="checkbox" checked={this.props.inStockOnly} ref="inStockOnlyInput" onChange={this.handleChange}/>
          			{' '}
          			Only show products in stock
        		</p>
      		</form>
		);
	}
});


var FilterableProductTable  = React.createClass({
	loadProducts: function(){
		$.ajax({
      		url: this.props.url,
      		dataType: 'json',
      		cache: false,
      		success: function(data) {
        		this.setState({products: data});
      		}.bind(this),
      		error: function(xhr, status, err) {
        		console.error(this.props.url, status, err.toString());
      		}.bind(this)
    	});
	},
	handleUserInput: function(filterText, inStockOnly) {
    	this.setState({
      		filterText: filterText,
      		inStockOnly: inStockOnly
    	});
  	},
	 getInitialState: function() {
    	return {
      		filterText: '',
      		inStockOnly: false,
      		products: []
    	};
  },
	componentDidMount: function() {
    	this.loadProducts();
  	},
	render: function () {
		return (
			<div className = "FilterableProductTable">
				<h1>FilterBox</h1>
				<SearchBar filterText={this.state.filterText} inStockOnly={this.state.inStockOnly} onUserInput={this.handleUserInput}/>
        		<ProductTable products={this.state.products} filterText={this.state.filterText} inStockOnly={this.state.inStockOnly}/>
			</div>
		);
	}
});

ReactDOM.render(
	<FilterableProductTable url="/api/products" />,
	document.getElementById('content2')
);