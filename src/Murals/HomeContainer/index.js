import React from 'react';
import Murals from '../MuralsList'
import CreateMural from '../CreateMural'
import EditMural from '../EditMural'
import MuralSearch from '../MuralSearch'
import ShowMural from '../ShowMural'
import UserShow from '../../Users/UserShow'

class MuralContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      murals: [],
      showEdit: false,
      showMural: false,
      showUser: false,
      muralObj: {},
      muralId: '',
      userObj: {},
      mural: {
        title: '',
        artist: '',
        image: '',
        description: '',
        locationDescription: '',
        year: '',
        affiliation: '',
        address: '',
        zipcode: '',
        lat: '',
        lng: ''
      }
    }
  }

  componentDidMount(){
    this.getMurals()  
  }

  getMurals = async () => {
    try{
      const foundMurals = await 
      fetch(process.env.REACT_APP_BACKEND_URL + '/murals/home', {
        credentials: 'include',
        method: 'GET'
      });
      if(foundMurals.status !== 200){
        throw Error(foundMurals.statusText)
      }
      const muralsParsed = await foundMurals.json();
      this.setState({murals: muralsParsed.murals})
    }
    catch(error){
      console.log(error);
      return error
    }    
  }

  searchMurals = async (search, event) => {
    event.preventDefault()
    try{
      const foundMurals = await 
      fetch(`${process.env.REACT_APP_BACKEND_URL}/murals/${search.searchProperty}/${search.searchTerm}`, {
        credentials: 'include',
        method: 'GET'
      })
      if(foundMurals.status !== 200){
        throw Error(foundMurals.statusText)
      }
      const muralsParsed = await foundMurals.json()
      this.setState({
        murals: muralsParsed.murals,
        showSearch: true
      })
    }
    catch(error){
      console.log(error);
      return error
    }
  }

  deleteMural = async (id, event) => {
    event.preventDefault()
    try{
      const deleteMural = await 
      fetch(process.env.REACT_APP_BACKEND_URL + '/murals/mural/' + id, {
        credentials: 'include',
        method: 'DELETE'
      })
      if(deleteMural.status !== 200){
        throw Error(deleteMural.statusText)
      }
      const parsedResponse = await deleteMural.json()
      this.setState({
        murals: this.state.murals.filter((mural, i) => mural._id !== id)
      })
    }
    catch(error){
      console.log(error);
      return error
    }
  }

  deleteUser = async (id, event) => {
    console.log('hitting deleteUser');
    event.preventDefault()
    try{
      const deleteUser = await
      fetch(process.env.REACT_APP_BACKEND_URL + '/users/user/' + id, {
        credentials: 'include',
        method: 'DELETE'
      })
      if(deleteUser.status !== 200){
        throw Error(deleteUser.statusText)
      }
      const parsedResponse = await deleteUser.json()
      console.log(parsedResponse);
    }
    catch(error){
      console.log(error);
      return error
    }
  }

  editMural = async (event) => {
    event.preventDefault()
    try{
      const editResponse = await 
      fetch(process.env.REACT_APP_BACKEND_URL + '/murals/mural/' + this.state.muralId, {
        credentials: 'include',
        method: 'PUT',
        body: JSON.stringify(this.state.mural),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      if(editResponse.status !== 200){
        throw Error(editResponse.statusText)
      }
      const parsedResponse = await editResponse.json()
      const editedMuralArray = this.state.murals.map((mural) => {
        if(mural._id === this.state.muralId){
          mural.title = parsedResponse.mural.title;
          mural.artist = parsedResponse.mural.artist;
          mural.description = parsedResponse.mural.description
          mural.locationDescription = parsedResponse.mural.locationDescription
          mural.year = parsedResponse.mural.year
          mural.affiliation = parsedResponse.mural.affiliation
          mural.address = parsedResponse.mural.address
          mural.lat = parsedResponse.mural.lat
          mural.lng = parsedResponse.mural.lng
          mural.zipcode = parsedResponse.mural.zipcode
        }
        return mural
      })
      this.setState({
        mural: editedMuralArray,
        showEdit: false
      })
    }
    catch(error){
      console.log(error);
      return error
    }
  }

  showMuralModal = (id, event) => {
    const muralToShow = this.state.murals.find((mural) => mural._id === id)
    this.setState({
      showMural: true,
      muralId: id,
      muralObj: muralToShow
    })
  }

  showEditModal = (id, event) => {
    const muralToEdit = this.state.murals.find((mural) => mural._id === id)
    this.setState({
      showEdit: true,
      muralId: id,
      mural: muralToEdit
    })
  }

  showUserModal = async (id, event) => {
    const mural = this.state.murals.find((mural) => mural._id === id)
    event.preventDefault()
    try{
      const showResponse = await
      fetch(process.env.REACT_APP_BACKEND_URL + '/users/user/' + id, {
        credentials: 'include',
        method: 'GET'
      })
      if(showResponse.status !==200){
        throw Error(showResponse.statusText)
      }
      const userParsed = await showResponse.json()
      this.setState({
        showUser: true,
        userObj: userParsed
      })
    }
    catch(error){
      console.log(error);
      return error
    }
  }

  updateMural = (event) => {
    this.setState({
      mural: {
        ...this.state.mural,
        [event.target.name]: event.target.value
      }
    })
  }

  render(){
    let edit;
    let mural;
    let user;
    let search = <MuralSearch
            searchMurals={this.searchMurals}
          />
    let list = <Murals 
            murals={this.state.murals}            
            showMuralModal={this.showMuralModal}
          />
    if(this.state.showEdit){
      edit = <EditMural 
          editMural={this.editMural} 
          updateMural={this.updateMural} 
          mural={this.state.mural}
        />
      search = ''
      list = ''
    }
    if(this.state.showMural){
      mural = <ShowMural 
          muralObj={this.state.muralObj}
          showEditModal={this.showEditModal}
          deleteMural={this.deleteMural}
          showUserModal={this.showUserModal}
        />
        list = '' 
    }
    if(this.state.showUser){
      user = <UserShow
          userObj={this.state.userObj}
          deleteUser={this.deleteUser}
        />
      list = ''
    }
    return(
      <div>
        {edit}
        {search}
        {mural}
        {list}
        {user}
      </div>
    )
  }
}

export default MuralContainer;