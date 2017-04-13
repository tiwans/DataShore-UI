import React from "react";
import {render} from "react-dom";
//import Product from "./product.jsx"
import "whatwg-fetch";
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
import {Link, IndexLink} from "react-router";
//import {store} from "./shared-state.jsx";

import {Grid, IconButton, Badge, Icon,Layout,Header,Navigation,Drawer,Textfield,Content } from 'react-mdl';
// const APIKEY = "f7545fd0e57b212af479493150d07df4";
// const BASE_URL = "https://api.themoviedb.org/3"
// const DISCOVER_API = BASE_URL + "/discover/movie?api_key=" + APIKEY;
// const GENRES_API = BASE_URL + "/genre/movie/list?api_key=" + APIKEY;
// import "./css/main.css";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = store.getState();
    }

    componentDidMount() {
        this.unsub = store.subscribe(() => this.setState(store.getState()));
    }

    // componentWillUnmount() {
    //     this.unsub();
    // }
    render() {
        var totalItems;
        if(this.state.items.length > 0){
            totalItems = 0;
            for(var i=0; i< this.state.items.length; i++){
                totalItems += this.state.items[i].quantity;
                console.log(this.state.items[i].quantity);
            }
        }else{
            totalItems=null;
        }
        return (
            <Grid style={{height: '100vh', position: 'relative'}}>
            <Layout style={{background: 'url(src/img/website_background_img.jpg) center / cover'}}>
                <Header transparent style={{color: 'white', position:"relative"}}>
                     <IconButton name="menu" id="demo-menu-lower-left" style ={{fontSize: "30px", textAlign: "right",position:"absolute", left:"20px"}} />
                    <h4>Movie Shopper</h4>
                    <Navigation style={{position:"absolute", right:"10px"}}>
                        <IndexLink to="/" activeClassName="active" style={{textDecoration: "none", color: "#FFF", weight: "bold"}}>
                            <Badge overlap>
                                <Icon style ={{fontSize: "30px", textAlign: "right"}}name="video_library" />
                            </Badge>
                        </IndexLink>
                        <Link to="/cart" activeClassName="active">
                            <Badge text={totalItems} overlap>
                                <Icon style ={{fontSize: "30px", textAlign: "right"}}name="shopping_cart" />
                            </Badge>
                        </Link>
                    </Navigation>
                </Header>
                {this.props.children}
            </Layout>
            </Grid>
        );
    }
}