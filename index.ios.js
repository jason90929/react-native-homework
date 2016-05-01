/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
    AppRegistry,
    Component,
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';

var simpleAuthClient = require('react-native-simple-auth');
// var RNInstagramOAuth = require('react-native-instagram-oauth');

var instagram = {
    client_id: '4d6e40aa09d54c0d9c57d1830f26723f',
    redirect_url: 'http://localhost:8081/'  // e.g.: 'test://init'
};

class ReactNativeHomework extends Component {
    constructor(props) {
        super(props);
        this.state = {
            access_token: "",
            // userData: null
        };
    }
    componentWillMount() {
        simpleAuthClient.configure('instagram', instagram);
    }
    clickInstagramLoginButton() {
        // var obj = {
        //     method: 'POST',
        //     headers: {
        //
        //         'client_id': '4d6e40aa09d54c0d9c57d1830f26723f',
        //         'redirect_uri': 'http://localhost:8081/',
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'Origin': '',
        //         'Host': 'api.producthunt.com'
        //
        // },
        // body: JSON.stringify({
        // 'client_id': '4d6e40aa09d54c0d9c57d1830f26723f',
        // 'redirect_uri': 'http://localhost:8081/',
        // 'grant_type': 'client_credentials'
        // })
        // };

        // fetch('https://api.instagram.com/oauth/authorize/?client_id=4d6e40aa09d54c0d9c57d1830f26723f&redirect_uri=ttp://localhost:8081/&response_type=code')
        //     .then((res) => {
        //         console.log(res);
        //         // console.warn(res.access_token);
        //         // console.warn(res.url);
        //         // this.setState({
        //         //     access_token: JSON.stringify(res)
        //         // });
        //         return res;
        //     })
        //     // .then((resJson) => {
        //     //     console.log(resJson);
        //     //     alert(resJson);
        //     // });

        simpleAuthClient.authorize('instagram').then((info) => {
            console.log(info);
        let token = info.token;
        let name = info.name;
    }).catch((error) => {
            let errorCode = error.code;
        let errorDescription = error.description;
    });

        // RNInstagramOAuth(instagram.client_id, instagram.redirect_url, (err, access_token) => {
        //     if (err) { console.log(err) }
        //     alert("success");
        //     if (access_token !== undefined) {
        //         console.log(access_token);
        //         alert("success");
        //         fetch('https://api.instagram.com/v1/users/self/?access_token='+access_token)
        //             .then((response) => response.json()).then((responseData) => {
        //
        //             this.setState({
        //                 userData: responseData
        //             });
        //             console.log("login...");
        //             console.log(responseData);
        //         });
        //     }
        // });
    }
    render() {
        if (!this.state.userData) {
            return this.renderLoginView();
        }

        return this.renderMainView(this.state.userData);
    }

    renderLoginView() {
        return (
            <View style={styles.container}>
    <TouchableOpacity onPress={this.clickInstagramLoginButton}>
    <Text>Login with Instagram</Text>
        <Text>{JSON.stringify(this.access_token)}</Text>

        </TouchableOpacity>
        </View>
    );
    }

    renderMainView(userData) {
        return (
            <View style={styles.container}>
    <Text>
        {userData}
        </Text>
        </View>
    );
    }

}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    thumbnail: {
        width: 53,
        height: 81,
    },
    loginWithInstagramButton: {
        // backgroundColor: "",
        fontSize: 20,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#000",
        textAlign: "center"
    }
});

AppRegistry.registerComponent('ReactNativeHomework', () => ReactNativeHomework);