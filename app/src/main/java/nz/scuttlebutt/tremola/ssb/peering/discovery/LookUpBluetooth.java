package nz.scuttlebutt.tremola.ssb.peering.discovery;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanResult;
import android.util.Log;
import nz.scuttlebutt.tremola.ssb.core.SSBid;

import java.util.List;
import java.util.Timer;
import java.util.TimerTask;


public class LookUpBluetooth extends LookUpClient {


    private final BluetoothLeScanner bluetoothLeScanner;
    private boolean scanning;
    private final Timer timer = new Timer();

    // Stops scanning after 10 seconds.
    private static final long SCAN_PERIOD = 3000L;

    public LookUpBluetooth(String ipAddress, int port, SSBid ed25519KeyPair, BluetoothAdapter bluetoothAdapter) {
        super(ipAddress, port, ed25519KeyPair);
        bluetoothLeScanner = bluetoothAdapter.getBluetoothLeScanner();
    }

    public void scanLeDevice() {
        if (bluetoothLeScanner != null) {
            if (!scanning) {
                // Stops scanning after a predefined scan period.
                timer.schedule(new TimerTask() {
                    @Override
                    public void run() {
                        scanning = false;
                        bluetoothLeScanner.stopScan(leScanCallback);
                        Log.e("BLUETOOTH", "Stop scanning");
                    }
                }, SCAN_PERIOD);

                // Filter scanned devices :
                // https://developer.android.com/reference/android/bluetooth/le/BluetoothLeScanner#startScan(java.util.List%3Candroid.bluetooth.le.ScanFilter%3E,%20android.bluetooth.le.ScanSettings,%20android.bluetooth.le.ScanCallback)
                scanning = true;
                bluetoothLeScanner.startScan(leScanCallback);
                Log.e("BLUETOOTH", "Start scanning!!!");
            } else {
                scanning = false;
                bluetoothLeScanner.stopScan(leScanCallback);
                Log.e("BLUETOOTH", "!!!!!Error scanning");
            }
        }
    }

    private final ScanCallback leScanCallback = new ScanCallback() {
        public void onScanResult(int callbackType, ScanResult result) {
            super.onScanResult(callbackType, result);
            Log.e("BLUETOOTH", result.toString());
        }

        public void onBatchScanResults(List<ScanResult> results) {
            super.onBatchScanResults(results);
            Log.e("BLUETOOTH", results.get(0).toString());
        }

        public void onScanFailed(int errorCode) {
            super.onScanFailed(errorCode);
            Log.e("BLUETOOTH", "ERROR : " + errorCode);
        }
    };

    @Override
    void sendQuery(String broadcastMessage) {
        //TODO
    }

//    @Override
//    void processQuery() {
//    }
}