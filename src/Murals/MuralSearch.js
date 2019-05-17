import React from 'react';

class MuralSearch extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			searchProperty: '',
			searchTerm: ''
		}
	}

	updateSearch =(event) => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	render(){
		return(
			<div>
				<h4>Search</h4>
				<form onSubmit={this.props.searchMurals.bind(null, this.state)}>
					<label>Choose Search Property
						<select name="searchProperty" onChange={this.updateSearch}>
							<option>Choose</option>
							<option>Artist</option>
							<option>Affiliation</option>
							<option>Zipcode</option>
						</select>
					</label>
					<label> Search
						<input
							type="text"
							name="searchTerm"
							onChange={this.updateSearch}
						/>
					</label>
					<button>Search</button>
				</form>
			</div>
		)
	}
}

export default MuralSearch