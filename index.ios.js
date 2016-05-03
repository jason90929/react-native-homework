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
    TextInput,
    TouchableOpacity
} from 'react-native';

// ES5 import
var simpleAuthClient = require('react-native-simple-auth');
var ReadImageData = require('NativeModules').ReadImageData;
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;
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
            imagePath: "",
            imageBase64: "",
            keyboardSpace: 0
        };

        this.updateKeyboardSpace = this.updateKeyboardSpace.bind(this);
        this.resetKeyboardSpace = this.resetKeyboardSpace.bind(this);
    }
    componentDidMount() {
        simpleAuthClient.configure('instagram', instagram);

        KeyboardEventEmitter.on(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
        KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
    }

    componentWillUnmount() {
        KeyboardEventEmitter.off(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
        KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
    }
    updateKeyboardSpace(frames) {
        if (frames.end) {
            this.setState({keyboardSpace: frames.end.height});
        } else {
            this.setState({keyboardSpace: frames.endCoordinates.height});
        }
    }

    resetKeyboardSpace() {
        this.setState({keyboardSpace: 0});
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
    // 照相
    takePicture() {
        this.camera.capture()
            .then(function(data) {
                // 從檔案路徑取得 base64 圖檔
                var path = data.path;
                ReadImageData.readImage(path, function(imageBase64) {
                    this.setState({
                        imagePath: path,
                        imageBase64: imageBase64,
                        status: 3
                    });
                }.bind(this));
            }.bind(this))
            .catch(error => {
                console.error(error);
            });
    }
    // 上傳至 Instagram
    uploadToInstagram() {
        var image = this.state.imagePath;
        var caption = this.state.caption;
        
        RNInstagramShare.share(image, caption);
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
                return this.renderTakePictureView();
                break;
            case 3:
                return this.renderCreateNewPostView();
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
                    <Text style={loginView.InstagramButtonText}>Login with Instagram</Text>
                </TouchableOpacity>
            </View>
        );
    }

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
                    onPress={this.pressLaunceCameraButton.bind(this)}
                    style={mainView.cameraButton}>
                    <Text style={mainView.cameraButtonText}>分享你今天的生活！</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }

    renderTakePictureView() {
        return (
            <View style={mainView.container}>
                <Camera
                    ref={(cam) => {
                        this.camera = cam;
                    }}
                    style={mainView.preview}
                    aspect={Camera.constants.Aspect.fill}>
                </Camera>
                <TouchableOpacity
                    onPress={this.takePicture.bind(this)}
                    style={mainView.cameraButton}>
                    <Text style={mainView.cameraButtonText}>拍照</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderCreateNewPostView() {
        return (
            <ScrollView style={mainView.scrollContainer}
                        keyboardDismissMode="interactive">
                <Image source={{uri: "data:image/jpeg;base64, " + this.state.imageBase64}}
                       style={mainView.capturedPicture} />

                <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                           onChangeText={(caption) => this.setState({caption})}
                           multiline={true}
                           value={this.state.caption} placeholder="在想些什麼？">

                </TextInput>
                <TouchableOpacity
                    onPress={this.uploadToInstagram.bind(this)}
                    style={mainView.cameraButton}>
                    <Text style={mainView.cameraButtonText}>上傳至Instagram</Text>
                </TouchableOpacity>

                <View style={{height: this.state.keyboardSpace}}></View>
            </ScrollView>
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
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize: 12
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
    cameraButton: {
        marginTop: 20
    },
    cameraButtonText: {
        fontSize: 18,
        textAlign: "center"
    },
    preview: {
        top: 0,
        justifyContent: 'flex-start',
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
    },
    capturedPicture: {
        // top: 0,
        justifyContent: 'flex-start',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width //與寬度同等
    }
});


AppRegistry.registerComponent('ReactNativeHomework', () => ReactNativeHomework);