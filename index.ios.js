/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
    AppRegistry,
    Component,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
} from 'react-native';

// ES5 import
var simpleAuthClient = require('react-native-simple-auth');
// ES6 import
import Camera from 'react-native-camera';

var instagram = {
    client_id: '4d6e40aa09d54c0d9c57d1830f26723f',
    redirect_uri: 'http://localhost:8081/'  // e.g.: 'test://init'
};

class ReactNativeHomework extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 0,
            token: "",
            userData: null,
            postText: ""
        };
    }
    componentWillMount() {
        simpleAuthClient.configure('instagram', instagram);
    }
    pressInstagramLoginButton() {
        var token = "";
        var userData = {};
        simpleAuthClient.authorize('instagram')
            .then(function(info) {
                // console.log(info);
                token = info.token;
                userData = info.data;
                this.setState({
                    status: 1,
                    token: token,
                    userData: userData
                });
            }.bind(this))
            .catch((error) => {
                console.error(error);
                let errorCode = error.code;
                let errorDescription = error.description;
            });
    }
    pressLaunceCameraButton() {
        this.camera.capture()
            .then(function(data) {
                console.log(data);
            }).then(function() {
                this.setState({
                    status: 2
                })
            }.bind(this))
            .catch(error => {
                console.error(error);
            });
    }
    render() {
        switch (this.state.status) {
            case 0:
                return this.renderLoginView();
                break;
            case 1:
                return this.renderMainView(this.state.userData);
                break;
            case 2:
                return this.renderNewPostView();
                break;
            default:
                return this.renderLoginView();
        }
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

                <TouchableOpacity
                    onPress={this.pressLaunceCameraButton.bind(this)}
                    style={mainView.cameraButton}>
                    <Camera
                        ref={(cam) => {
                        this.camera = cam;
                    }}>
                        <Text style={mainView.cameraButtonText}>分享你今天的生活！</Text>
                    </Camera>
                </TouchableOpacity>
            </View>
        );
    }

    renderNewPostView() {
        return (
            <View style={mainView.container}>
                <Camera
                    ref={(cam) => {
                        this.camera = cam;
                    }}
                    style={mainView.preview}
                    aspect={Camera.constants.Aspect.fill}>
                </Camera>
                <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(postText) => this.setState({postText})}
                    value={this.state.postText} placeholder="在想些什麼？">

                </TextInput>
                <TouchableOpacity
                    style={mainView.cameraButton}>
                        <Text style={mainView.cameraButtonText}>TODO: 張貼！</Text>
                </TouchableOpacity>
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
        paddingRight: 32
    },
    InstagramButtonText: {
        fontSize: 20,
        fontStyle: "italic",
        textAlign: "center",
        color: "#fff"
    }
});

/*
 * 主頁面 CSS
 */
var mainView = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    profile_picture: {
        marginTop: 20,
        marginBottom: 20,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width //與寬度同等
    },
    profile_text: {
        flexWrap: "wrap",
        textAlign: "left",
        marginTop: 10,
        marginBottom: 10
    },
    cameraButton: {
        marginTop: 20
    },
    cameraButtonText: {
        fontSize: 18,
        textAlign: "center"
    },
    preview: {
        // flex: 1,
        top: 0,
        justifyContent: 'flex-start',
        // alignItems: 'top',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width //與寬度同等
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        margin: 40
    }
});


AppRegistry.registerComponent('ReactNativeHomework', () => ReactNativeHomework);