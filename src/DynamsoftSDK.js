import React from 'react';
import Dynamsoft from 'dwt';

export default class DWT extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scanners: [],
            currentScanner: "Looking for devices.."
        };
    }
    DWObject = null;
    containerId = 'dwtcontrolContainer';
    width = "100%";
    height = "600";
    componentDidMount() {
        Dynamsoft.DWT.RegisterEvent('OnWebTwainReady', () => {
            this.DWObject = Dynamsoft.DWT.GetWebTwain(this.containerId);
            if (this.DWObject) {
                let vCount = this.DWObject.SourceCount;
                let sourceNames = [];
                for (let i = 0; i < vCount; i++)
                    sourceNames.push(this.DWObject.GetSourceNameItems(i));
                this.setState({ scanners: sourceNames });
            }
        });
        this.loadDWT();
    }
    loadDWT() {
        Dynamsoft.DWT.ProductKey = this.props.productKey;
        Dynamsoft.DWT.ResourcesPath = "dwt-resources";
        Dynamsoft.DWT.Containers = [{ ContainerId: this.containerId, Width: this.width, Height: this.height }];

        window.OnWebTwainNotFoundOnWindowsCallback = ()  => {
            alert('OnWebTwainNotFoundOnWindowsCallback')
        }

        window.OnWebTwainNotFoundOnLinuxCallback = ()  => {
            alert('OnWebTwainNotFoundOnLinuxCallback')
        }

        window.OnWebTwainNotFoundOnMacCallback = ()  => {
            alert('OnWebTwainNotFoundOnMacCallback')
        }

        window.OnRemoteWebTwainNotFoundCallback = ()  => {
            alert('OnRemoteWebTwainNotFoundCallback')
        }

        let checkScriptLoaded = () => {
            if (Dynamsoft.Lib.detect.scriptLoaded) {
                this.modulizeInstallJS();
                alert('Dynamsoft.DWT.Load()')
                Dynamsoft.DWT.Load();
            } else {
                setTimeout(() => {
                    checkScriptLoaded();
                }, 1000);
            }
        };
        checkScriptLoaded();
    }
    onSourceChange(value) {
        this.setState({ currentScanner: value });
    }
    acquireImage() {
        this.DWObject.CloseSource();
        for (let i = 0; i < this.DWObject.SourceCount; i++) {
            if (this.DWObject.GetSourceNameItems(i) === this.state.currentScanner) {
                this.DWObject.SelectSourceByIndex(i);
                break;
            }
        }
        this.DWObject.OpenSource();
        this.DWObject.AcquireImage();
    }
    loadImagesOrPDFs() {
        this.DWObject.IfShowFileDialog = true;
        this.DWObject.Addon.PDF.SetResolution(200);
        this.DWObject.Addon.PDF.SetConvertMode(1/*Dynamsoft.DWT.EnumDWT_ConvertMode.CM_RENDERALL*/);
        this.DWObject.LoadImageEx("", 5 /*Dynamsoft.DWT.EnumDWT_ImageType.IT_ALL*/,
            () => { },
            (errorCode, errorString) => alert(errorString));
    }
    render() {
        return (
            <div style={{ width: "30%", margin: "0 auto" }}>
                <select style={{ width: "100%" }} tabIndex="1" value={this.state.currentScanner} onChange={(e) => this.onSourceChange(e.target.value)}>
                    {
                        this.state.scanners.length > 0 ?
                            this.state.scanners.map((_name, _index) =>
                                <option value={_name} key={_index}>{_name}</option>
                            )
                            :
                            <option value="Looking for devices..">Looking for devices..</option>
                    }
                </select>
                <button tabIndex="2" style={{ marginRight: "4%", width: "48%" }}
                    onClick={() => this.acquireImage()}
                    disabled={this.state.scanners.length > 0 ? "" : "disabled"}
                >Scan</button>
                <button tabIndex="3" style={{ margin: "2% 0", width: "48%" }}
                    onClick={() => this.loadImagesOrPDFs()}
                >Load</button>
                <div id={this.containerId}></div>
            </div >
        );
    }
    modulizeInstallJS() {
        let _DWT_Reconnect = window.DWT_Reconnect;
        window.DWT_Reconnect = (...args) => _DWT_Reconnect.call({ Dynamsoft: Dynamsoft }, ...args);
        let __show_install_dialog = window._show_install_dialog;
        window._show_install_dialog = (...args) => __show_install_dialog.call({ Dynamsoft: Dynamsoft }, ...args);
        let _OnWebTwainOldPluginNotAllowedCallback = window.OnWebTwainOldPluginNotAllowedCallback;
        window.OnWebTwainOldPluginNotAllowedCallback = (...args) => _OnWebTwainOldPluginNotAllowedCallback.call({ Dynamsoft: Dynamsoft }, ...args);
        let _OnWebTwainNeedUpgradeCallback = window.OnWebTwainNeedUpgradeCallback;
        window.OnWebTwainNeedUpgradeCallback = (...args) => _OnWebTwainNeedUpgradeCallback.call({ Dynamsoft: Dynamsoft }, ...args);
        let _OnWebTwainPreExecuteCallback = window.OnWebTwainPreExecuteCallback;
        window.OnWebTwainPreExecuteCallback = (...args) => _OnWebTwainPreExecuteCallback.call({ Dynamsoft: Dynamsoft }, ...args);
        let _OnWebTwainPostExecuteCallback = window.OnWebTwainPostExecuteCallback;
        window.OnWebTwainPostExecuteCallback = (...args) => _OnWebTwainPostExecuteCallback.call({ Dynamsoft: Dynamsoft }, ...args);
        let _OnRemoteWebTwainNotFoundCallback = window.OnRemoteWebTwainNotFoundCallback;
        window.OnRemoteWebTwainNotFoundCallback = (...args) => _OnRemoteWebTwainNotFoundCallback.call({ Dynamsoft: Dynamsoft }, ...args);
        let _OnRemoteWebTwainNeedUpgradeCallback = window.OnRemoteWebTwainNeedUpgradeCallback;
        window.OnRemoteWebTwainNeedUpgradeCallback = (...args) => _OnRemoteWebTwainNeedUpgradeCallback.call({ Dynamsoft: Dynamsoft }, ...args);
        let _OnWebTWAINDllDownloadFailure = window.OnWebTWAINDllDownloadFailure;
        window.OnWebTWAINDllDownloadFailure = (...args) => _OnWebTWAINDllDownloadFailure.call({ Dynamsoft: Dynamsoft }, ...args);
    }
}
