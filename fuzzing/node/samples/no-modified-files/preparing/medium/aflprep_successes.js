function run_test(algorithmNames, slowTest) {
    setup({explicit_timeout: true});
        {name: "AES-CTR",  resultType: CryptoKey, usages: ["encrypt", "decrypt", "wrapKey", "unwrapKey"], mandatoryUsages: []},
        {name: "AES-CBC",  resultType: CryptoKey, usages: ["encrypt", "decrypt", "wrapKey", "unwrapKey"], mandatoryUsages: []},
        {name: "AES-GCM",  resultType: CryptoKey, usages: ["encrypt", "decrypt", "wrapKey", "unwrapKey"], mandatoryUsages: []},
        {name: "AES-KW",   resultType: CryptoKey, usages: ["wrapKey", "unwrapKey"], mandatoryUsages: []},
        {name: "HMAC",     resultType: CryptoKey, usages: ["sign", "verify"], mandatoryUsages: []},
        {name: "RSASSA-PKCS1-v1_5", resultType: "CryptoKeyPair", usages: ["sign", "verify"], mandatoryUsages: ["sign"]},
        {name: "RSA-PSS",  resultType: "CryptoKeyPair", usages: ["sign", "verify"], mandatoryUsages: ["sign"]},
        {name: "RSA-OAEP", resultType: "CryptoKeyPair", usages: ["encrypt", "decrypt", "wrapKey", "unwrapKey"], mandatoryUsages: ["decrypt", "unwrapKey"]},
        {name: "ECDSA",    resultType: "CryptoKeyPair", usages: ["sign", "verify"], mandatoryUsages: ["sign"]},
        {name: "ECDH",     resultType: "CryptoKeyPair", usages: ["deriveKey", "deriveBits"], mandatoryUsages: ["deriveKey", "deriveBits"]}
    ];
    var testVectors = [];
    if (algorithmNames && !Array.isArray(algorithmNames)) {
        algorithmNames = [algorithmNames];
    };
    allTestVectors.forEach(function(vector) {
        if (!algorithmNames || algorithmNames.includes(vector.name)) {
            testVectors.push(vector);
        }
    });
    function parameterString(algorithm, extractable, usages) {
        var result = "(" +
                        objectToString(algorithm) + ", " +
                        objectToString(extractable) + ", " +
                        objectToString(usages) +
                     ")";
        return result;
    }
    function testSuccess(algorithm, extractable, usages, resultType, testTag) {
        promise_test(function(test) {
            return subtle.generateKey(algorithm, extractable, usages)
            .then(function(result) {
                if (resultType === "CryptoKeyPair") {
                    assert_goodCryptoKey(result.privateKey, algorithm, extractable, usages, "private");
                    assert_goodCryptoKey(result.publicKey, algorithm, extractable, usages, "public");
                } else {
                    assert_goodCryptoKey(result, algorithm, extractable, usages, "secret");
                }
            }, function(err) {
                assert_unreached("Threw an unexpected error: " + err.toString());
            });
        }, testTag + ": generateKey" + parameterString(algorithm, extractable, usages));
    }
    testVectors.forEach(function(vector) {
        allNameVariants(vector.name, slowTest).forEach(function(name) {
            allAlgorithmSpecifiersFor(name).forEach(function(algorithm) {
                allValidUsages(vector.usages, false, vector.mandatoryUsages).forEach(function(usages) {
                    [false, true].forEach(function(extractable) {
                        subsetTest(testSuccess, algorithm, extractable, usages, vector.resultType, "Success");
                    });
                });
            });
        });
    });
}