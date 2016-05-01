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

var instagram = {
    client_id: '4d6e40aa09d54c0d9c57d1830f26723f',
    redirect_uri: 'http://localhost:8081/'  // e.g.: 'test://init'
};

class ReactNativeHomework extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            userData: null
        };
    }
    componentWillMount() {
        simpleAuthClient.configure('instagram', instagram);
    }
    pressInstagramLoginButton() {
        var token = "";
        var userData = {};
        simpleAuthClient.authorize('instagram').then(function(info) {
            // console.log(info);
            token = info.token;
            userData = info.data;


            this.setState({
                token: token,
                userData: userData
            });
        }.bind(this)).catch((error) => {
            console.log(error);
            let errorCode = error.code;
            let errorDescription = error.description;
        });
    }
    render() {
        if (!this.state.userData) {
            return this.renderLoginView();
        }

        return this.renderMainView(this.state.userData);
    }
    renderLoginView() {
        return (
            <View style={mainView.container}>
                <TouchableOpacity
                    onPress={this.pressInstagramLoginButton.bind(this)}
                    style={loginView.InstagramButton}>
                    <Text style={loginView.InstagramButtonText} >Login with Instagram</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderMainView(userData) {
        return (
            <View style={mainView.container}>
                <Text style={mainView.profile_text}>
                    Instagram Id: {userData.id}
                </Text>
                <Text style={mainView.profile_text}>
                    Username: {userData.username}
                </Text>

                <Image source={{uri: userData.profile_picture}}
                       style={mainView.profile_picture} />

                <Text style={mainView.profile_text}>
                    我是 {userData.full_name} ，
                </Text>
                <Text style={mainView.profile_text}>
                    我總共有 {userData.counts.media} 則貼文，
                </Text>
                <Text style={mainView.profile_text}>
                    我追蹤了 {userData.counts.follows} 位使用者，
                </Text>
                <Text style={mainView.profile_text}>
                    有 {userData.counts.followed_by} 位使用者追蹤我。
                </Text>
            </View>
        );
    }
}
/*
 * 登入的按鈕 CSS
 */
var loginView = StyleSheet.create({
    InstagramButton: {
        borderRadius: 14,
        backgroundColor: "#3F729B",
        paddingBottom: 8,
        paddingTop: 8,
        paddingLeft: 32,
        paddingRight: 32,
    },
    InstagramButtonText: {
        fontSize: 20,
        fontStyle: "italic",
        textAlign: "center",
        color: "#fff"
    },
});

/*
 * 主頁面 CSS
 */
var mainView = StyleSheet.create({
    container: {
        flex: 1,
        height: 100,
        // flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    profile_picture: {
        marginTop: 20,
        marginBottom: 20,
        width: 150,
        height: 150
    },
    profile_text: {
        "flexWrap": "wrap",
        width: 200,
        textAlign: "left"
        // flex: 1,
    }
});


AppRegistry.registerComponent('ReactNativeHomework', () => ReactNativeHomework);