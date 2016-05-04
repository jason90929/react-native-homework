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
    ScrollView,
    TouchableOpacity
} from 'react-native';

// ES5 import
var simpleAuthClient = require('react-native-simple-auth');
var RNInstagramShare = require('react-native-instagram-share');

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
            caption: "",
            imagePath: ""
        };
    }
    componentDidMount() {
        simpleAuthClient.configure('instagram', instagram);
    }
    // 登入 Instagram
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
                this.setState({
                    status: 0
                });
                let errorCode = error.code;
                let errorDescription = error.description;
            });
    }
    // 按下啟動相機按鈕
    pressLaunceCameraButton() {
        this.setState({
            status: 2
        });
    }
    // 照相事件
    takePicture() {
        this.camera.capture()
            .then(function (data) {
                var image = data.path;
                var caption = "Test caption";

                // 啟動並上傳至 Instagram
                RNInstagramShare.share(image, caption);
            }.bind(this))
            .catch(error => {
                console.error(error);
            });
    }
    /*
     * 依照 status 決定要刷什麼頁面
     * 0: 登入畫面
     * 1: 已登入的主頁面
     * 2: 相機畫面
     */
    render() {
        switch (this.state.status) {
            case 0:
                return this.renderLoginView();
                break;
            case 1:
                return this.renderMainView(this.state.userData);
                break;
            case 2:
                return this.renderTakePictureView();
                break;
            default:
                return this.renderLoginView();
        }
    }
    // 起始頁面(登入)
    renderLoginView() {
        return (
            <View style={mainView.container}>
                <TouchableOpacity
                    onPress={this.pressInstagramLoginButton.bind(this)}
                    style={loginView.InstagramButton}>
                    <Text style={loginView.InstagramButtonText}>Login with Instagram</Text>
                </TouchableOpacity>
            </View>
        );
    }
    // 主要頁面
    renderMainView(userData) {
        return (
            <ScrollView style={mainView.scrollContainer}>
                <Text style={mainView.item}>
                    Instagram Id: {userData.id}
                </Text>
                <Text style={mainView.item}>
                    Username: {userData.username}
                </Text>

                <Image source={{uri: userData.profile_picture}}
                       style={mainView.profilePicture} />

                <Text style={mainView.profileText}>
                    我是 {userData.full_name}
                </Text>
                <Text style={mainView.profileText}>
                    我總共有 {userData.counts.media} 則貼文
                </Text>
                <Text style={mainView.profileText}>
                    我追蹤了 {userData.counts.follows} 位使用者
                </Text>
                <Text style={mainView.profileText}>
                    有 {userData.counts.followed_by} 位使用者追蹤我
                </Text>

                <TouchableOpacity
                    onPress={this.pressLaunceCameraButton.bind(this)}>
                    <Text style={mainView.launchCameraButton}>分享你今天的生活！</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }
    // 顯示照相頁面
    renderTakePictureView() {
        return (
            <View style={{flex: 1}}>
                <Camera
                    ref={(cam) => {
                        this.camera = cam;
                    }}
                    style={cameraView.preview}
                    aspect={Camera.constants.Aspect.fill}>
                    <Text style={cameraView.capture} onPress={this.takePicture.bind(this)}>Share to Instagram</Text>
                </Camera>
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
    scrollContainer: {
        flex: 1,
        marginTop: 20,
        backgroundColor: '#F5FCFF'
    },
    profilePicture: {
        marginTop: 6,
        marginBottom: 20,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width //與寬度同等
    },
    profileText: {
        flexWrap: "wrap",
        textAlign: "center",
        marginTop: 6,
        marginBottom: 6
    },
    launchCameraButton: {
        marginTop: 20,
        fontSize: 18,
        textAlign: "center",
        padding: 10,
        width: Dimensions.get('window').width,
        backgroundColor: '#3F729B',
        color: "#fff"
    }
});

/*
 * 相機 CSS
 */
var cameraView = StyleSheet.create({
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        margin: 40,
        fontSize: 10
    }
});

AppRegistry.registerComponent('ReactNativeHomework', () => ReactNativeHomework);