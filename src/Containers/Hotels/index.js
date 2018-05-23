import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import earthLoader from "../../earth.gif";
import {Button, MediaObjectSection, Thumbnail} from "react-foundation";
import Moment from 'react-moment';

const apiUrl = 'http://fake-hotel-api.herokuapp.com/api';
const numberOfHotels = 5;

class Hotels extends Component {
  state = {
    error: undefined,
    isLoadedHotels: true,
    hotels: [],
    isLoadedReviews: true,
    reviews: [],
    noReviews:false
  };

  onLoadReviewsClick = (id) => {
    let reviewExist = this.state.reviews.some( item => item['hotel_id'] === id );
    if(!reviewExist){
      this.setState({
        isLoadedReviews: false,
      });
      fetch(`${apiUrl}/reviews?hotel_id=${id}`)
        .then(response => {
          return response.json()
            .then(data => {
              if(response.ok){
                if(data.length > 0){
                  this.setState({
                    noReviews:false
                  });
                  document.getElementById(id).innerHTML = 'Hide reviews';
                }else{
                  this.setState({
                    noReviews:true
                  })
                }
                return data
              }else{
                return Promise.reject({status: response.status, data});
              }
            });
        })
        .then(
          (result) =>
            this.setState({
              reviews: this.state.reviews.concat(result),
              error:undefined,
              isLoadedReviews: true,
            })
        )
        .catch(error =>
          this.setState({
            isLoadedReviews: true,
            error
          })
        );
    }else{
      let reviewsArray = this.state.reviews.filter( item => {
        return item.hotel_id !== id
      });
      this.setState({
        reviews: reviewsArray,
      });
      document.getElementById(id).innerHTML = 'Show reviews';
    }
  };

  onLoadHotels = () => {
    this.setState({
      isLoadedHotels: false,
    });
    fetch(`${apiUrl}/hotels?count=${numberOfHotels}`)
    .then(response => {
      return response.json()
        .then(data => {
          if(response.ok){
            return data
          }else{
            return Promise.reject({status: response.status, data});
          }
        });
    })
    .then(result =>
      this.setState({
        isLoadedHotels: true,
        hotels: this.state.hotels.concat(result),
        error:undefined
      })
    )
    .catch(error =>
      this.setState({
        isLoadedHotels: true,
        error
      })
    )
  };

  render() {
    const { error, isLoadedHotels, hotels, isLoadedReviews, reviews, noReviews} = this.state;
    return (
      <div>
        <ul className="list">
          {hotels.length > 0 && hotels.map(item => (
            <li key={item.id} className="list-item">
              <MediaObjectSection>
                {item.images.map((img, index) => {
                  if(index < 5){
                    return <Thumbnail src={img} key={index}/>
                  }
                })}
                <p><b>Name: </b>{item.name}</p>
                <p><b>Location: </b>{item.country} - {item.city}</p>
                <p><b>Price: </b>{item.price} $</p>
                <p><span>
                  <b>From: </b>
                  <Moment format="MM/DD/YYYY">
                    {item.date_start}
                  </Moment>
                </span>
                <span>
                  <b> To: </b>
                  <Moment format="MM/DD/YYYY">
                    {item.date_end}
                  </Moment>
                </span>
                </p>
                <p><b>Stars: </b>{item.stars}</p>
                <p><b>Description: </b>{item.description}</p>
                <ul className="list">
                  {reviews.map( (i) => {
                    if(i.hotel_id === item.id) {
                      return <li key={i.name} className="list-item">
                        {!i.positive ? <p className="bad">BAD</p> : <p className="good">GOOD</p>}
                        <p><b>Comment: </b>{i.comment}</p>
                      </li>
                    }
                  })}
                </ul>
                { noReviews && <p className="no-review">No reviews for this hotel at the moment.</p> }
                {!isLoadedReviews && <div className="loaderHolder"><img src={earthLoader}/></div>}
                <Button onClick={() => this.onLoadReviewsClick(item.id)} id={item.id}>Show reviews</Button>
              </MediaObjectSection>
            </li>
          ))}
        </ul>
        {error && <div className="errorHolder">Something went wrong :-( try again or contact support!</div>}
        {!isLoadedHotels && <div className="loaderHolder"><img src={earthLoader}/></div>}
        <Button onClick={this.onLoadHotels}>{hotels.length < 5 ? "Load hotels" : "Load more hotels"}</Button>
      </div>
    );
  }
}

export default withRouter(Hotels);
