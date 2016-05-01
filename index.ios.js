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
    clickInstagramLoginButton() {
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
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={this.clickInstagramLoginButton.bind(this)}>
                    <Text style={styles.loginWithInstagramButton}>Login with Instagram</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderMainView(userData) {
        return (
            <View style={styles.container}>
                <Image source={{uri: userData.profile_picture}}
                    style={styles.profile_picture} />
                <Text style={styles.profile_text}>
                    {JSON.stringify(userData.counts)}
                </Text>
                <Text style={styles.profile_text}>
                    {userData.id}
                </Text>
                <Text style={styles.profile_text}>
                    {userData.username}
                </Text>
                <Text style={styles.profile_text}>
                    {userData.full_name}
                </Text>
            </View>
        );
    }

}

var styles = StyleSheet.create({
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
        width: 150,
        height: 150,
    },
    loginWithInstagramButton: {
        fontSize: 20,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#3F729B",
        borderRadius: 8,
        backgroundColor: "#3F729B",
        paddingBottom: 6,
        paddingTop: 6,
        paddingLeft: 8,
        paddingRight: 8,
        textAlign: "center",
        color: "#fff"
    },
    profile_text: {
        "flexWrap": "wrap",
        // flex: 1,
    }
});

AppRegistry.registerComponent('ReactNativeHomework', () => ReactNativeHomework);