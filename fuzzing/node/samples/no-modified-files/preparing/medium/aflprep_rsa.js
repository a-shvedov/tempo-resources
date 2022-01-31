function run_test() {
    var all_promises = [];
    var vectors = getTestVectors();
    var passingVectors = vectors.passing;
    var failingVectors = vectors.failing;
    passingVectors.forEach(function(vector) {
        var promise = importVectorKeys(vector, ["encrypt"], ["decrypt"])
        .then(function(vectors) {
            if (!("ciphertext" in vector)) {
                return;
            }
            promise_test(function(test) {
                return subtle.decrypt(vector.algorithm, vector.privateKey, vector.ciphertext)
                .then(function(plaintext) {
                    assert_true(equalBuffers(plaintext, vector.plaintext, "Decryption works"));
                }, function(err) {
                    assert_unreached("Decryption should not throw error " + vector.name + ": " + err.message + "'");
                });
            }, vector.name + " decryption");
        }, function(err) {
            promise_test(function(test) {
                assert_unreached("importVectorKeys failed for " + vector.name + ". Message: ''" + err.message + "''");
            }, "importVectorKeys step: " + vector.name + " decryption");
        });
        all_promises.push(promise);
    });
    passingVectors.forEach(function(vector) {
        var promise = importVectorKeys(vector, ["encrypt"], ["decrypt"])
        .then(function(vectors) {
            if (!("ciphertext" in vector)) {
                return;
            }
            promise_test(function(test) {
                var ciphertext = copyBuffer(vector.ciphertext);
                var operation = subtle.decrypt(vector.algorithm, vector.privateKey, ciphertext)
                .then(function(plaintext) {
                    assert_true(equalBuffers(plaintext, vector.plaintext, "Decryption works"));
                }, function(err) {
                    assert_unreached("Decryption should not throw error " + vector.name + ": " + err.message + "'");
                });
                ciphertext[0] = 255 - ciphertext[0];
                return operation;
            }, vector.name + " decryption with altered ciphertext");
        }, function(err) {
            promise_test(function(test) {
                assert_unreached("importVectorKeys failed for " + vector.name + ". Message: ''" + err.message + "''");
            }, "importVectorKeys step: " + vector.name + " decryption with altered ciphertext");
        });
        all_promises.push(promise);
    });
    passingVectors.forEach(function(vector) {
        var promise = importVectorKeys(vector, ["encrypt"], ["decrypt"])
        .then(function(vectors) {
            promise_test(function(test) {
                return subtle.decrypt(vector.algorithm, vector.publicKey, vector.ciphertext)
                .then(function(plaintext) {
                    assert_unreached("Should have thrown error for using publicKey to decrypt in " + vector.name + ": " + err.message + "'");
                }, function(err) {
                    assert_equals(err.name, "InvalidAccessError", "Should throw InvalidAccessError instead of " + err.message);
                });
            }, vector.name + " using publicKey to decrypt");
        }, function(err) {
            promise_test(function(test) {
                assert_unreached("importVectorKeys failed for " + vector.name + ". Message: ''" + err.message + "''");
            }, "importVectorKeys step: " + vector.name + " using publicKey to decrypt");
        });
        all_promises.push(promise);
    });
    passingVectors.forEach(function(originalVector) {
        var vector = Object.assign({}, originalVector);
        var promise = importVectorKeys(vector, ["encrypt"], ["unwrapKey"])
        .then(function(vectors) {
            promise_test(function(test) {
                return subtle.decrypt(vector.algorithm, vector.publicKey, vector.ciphertext)
                .then(function(plaintext) {
                    assert_unreached("Should have thrown error for no decrypt usage in " + vector.name + ": " + err.message + "'");
                }, function(err) {
                    assert_equals(err.name, "InvalidAccessError", "Should throw InvalidAccessError instead of " + err.message);
                });
            }, vector.name + " no decrypt usage");
        }, function(err) {
            promise_test(function(test) {
                assert_unreached("importVectorKeys failed for " + vector.name + ". Message: ''" + err.message + "''");
            }, "importVectorKeys step: " + vector.name + " no decrypt usage");
        });
        all_promises.push(promise);
    });
    passingVectors.forEach(function(vector) {
        var promise = importVectorKeys(vector, ["encrypt"], ["decrypt"])
        .then(function(vectors) {
            promise_test(function(test) {
                var plaintext = copyBuffer(vector.plaintext);
                var operation = subtle.encrypt(vector.algorithm, vector.publicKey, plaintext)
                .then(function(ciphertext) {
                    assert_equals(ciphertext.byteLength * 8, vector.privateKey.algorithm.modulusLength, "Ciphertext length matches modulus length");
                    return subtle.decrypt(vector.algorithm, vector.privateKey, ciphertext)
                    .then(function(result) {
                        assert_true(equalBuffers(result, vector.plaintext), "Round trip returns original plaintext");
                        return ciphertext;
                    }, function(err) {
                        assert_unreached("decrypt error for test " + vector.name + ": " + err.message + "'");
                    });
                })
                .then(function(priorCiphertext) {
                    return subtle.encrypt(vector.algorithm, vector.publicKey, vector.plaintext)
                    .then(function(ciphertext) {
                        assert_false(equalBuffers(priorCiphertext, ciphertext), "Two encrypts give different results")
                    }, function(err) {
                        assert_unreached("second time encrypt error for test " + vector.name + ": '" + err.message + "'");
                    });
                }, function(err) {
                    assert_unreached("decrypt error for test " + vector.name + ": '" + err.message + "'");
                });
                plaintext[0] = 255 - plaintext[0];
                return operation;
            }, vector.name + " with altered plaintext");
        }, function(err) {
            promise_test(function(test) {
                assert_unreached("importVectorKeys failed for " + vector.name + ". Message: ''" + err.message + "''");
            }, "importVectorKeys step: " + vector.name + " with altered plaintext");
        });
        all_promises.push(promise);
    });
    passingVectors.forEach(function(vector) {
        var promise = importVectorKeys(vector, ["encrypt"], ["decrypt"])
        .then(function(vectors) {
            promise_test(function(test) {
                return subtle.encrypt(vector.algorithm, vector.publicKey, vector.plaintext)
                .then(function(ciphertext) {
                    assert_equals(ciphertext.byteLength * 8, vector.privateKey.algorithm.modulusLength, "Ciphertext length matches modulus length");
                    return subtle.decrypt(vector.algorithm, vector.privateKey, ciphertext)
                    .then(function(result) {
                        assert_true(equalBuffers(result, vector.plaintext), "Round trip returns original plaintext");
                        return ciphertext;
                    }, function(err) {
                        assert_unreached("decrypt error for test " + vector.name + ": " + err.message + "'");
                    });
                })
                .then(function(priorCiphertext) {
                    return subtle.encrypt(vector.algorithm, vector.publicKey, vector.plaintext)
                    .then(function(ciphertext) {
                        assert_false(equalBuffers(priorCiphertext, ciphertext), "Two encrypts give different results")
                    }, function(err) {
                        assert_unreached("second time encrypt error for test " + vector.name + ": '" + err.message + "'");
                    });
                }, function(err) {
                    assert_unreached("decrypt error for test " + vector.name + ": '" + err.message + "'");
                });
            }, vector.name);
        }, function(err) {
            promise_test(function(test) {
                assert_unreached("importVectorKeys failed for " + vector.name + ". Message: ''" + err.message + "''");
            }, "importVectorKeys step: " + vector.name);
        });
        all_promises.push(promise);
    });
    passingVectors.forEach(function(vector) {
        var promise = importVectorKeys(vector, ["encrypt"], ["decrypt"])
        .then(function(vectors) {
            var plaintext = new Uint8Array(vector.plaintext.byteLength + 1);
            plaintext.set(plaintext, 0);
            plaintext.set(new Uint8Array([32]), vector.plaintext.byteLength);
            promise_test(function(test) {
                return subtle.encrypt(vector.algorithm, vector.publicKey, plaintext)
                .then(function(ciphertext) {
                    assert_unreached("Should have thrown error for too long plaintext in " + vector.name + ": " + err.message + "'");
                }, function(err) {
                    assert_equals(err.name, "OperationError", "Should throw OperationError instead of " + err.message);
                });
            }, vector.name + " too long plaintext");
        }, function(err) {
            promise_test(function(test) {
                assert_unreached("importVectorKeys failed for " + vector.name + ". Message: ''" + err.message + "''");
            }, "importVectorKeys step: " + vector.name + " too long plaintext");
        });
        all_promises.push(promise);
    });
    passingVectors.forEach(function(vector) {
        var promise = importVectorKeys(vector, ["encrypt"], ["decrypt"])
        .then(function(vectors) {
            promise_test(function(test) {
                return subtle.encrypt(vector.algorithm, vector.privateKey, vector.plaintext)
                .then(function(ciphertext) {
                    assert_unreached("Should have thrown error for using privateKey to encrypt in " + vector.name + ": " + err.message + "'");
                }, function(err) {
                    assert_equals(err.name, "InvalidAccessError", "Should throw InvalidAccessError instead of " + err.message);
                });
            }, vector.name + " using privateKey to encrypt");
        }, function(err) {
            promise_test(function(test) {
                assert_unreached("importVectorKeys failed for " + vector.name + ". Message: ''" + err.message + "''");
            }, "importVectorKeys step: " + vector.name + " using privateKey to encrypt");
        });
        all_promises.push(promise);
    });
    passingVectors.forEach(function(originalVector) {
        var vector = Object.assign({}, originalVector);
        var promise = importVectorKeys(vector, [], ["decrypt"])
        .then(function(vectors) {
            promise_test(function(test) {
                return subtle.encrypt(vector.algorithm, vector.publicKey, vector.plaintext)
                .then(function(ciphertext) {
                    assert_unreached("Should have thrown error for no encrypt usage in " + vector.name + ": " + err.message + "'");
                }, function(err) {
                    assert_equals(err.name, "InvalidAccessError", "Should throw InvalidAccessError instead of " + err.message);
                });
            }, vector.name + " no encrypt usage");
        }, function(err) {
            promise_test(function(test) {
                assert_unreached("importVectorKeys failed for " + vector.name + ". Message: ''" + err.message + "''");
            }, "importVectorKeys step: " + vector.name + " no encrypt usage");
        });
        all_promises.push(promise);
    });
    promise_test(function() {
        return Promise.all(all_promises)
            .then(function() {done();})
            .catch(function() {done();})
    }, "setup");
    function importVectorKeys(vector, publicKeyUsages, privateKeyUsages) {
        var publicPromise, privatePromise;
        if (vector.publicKey !== null) {
            publicPromise = new Promise(function(resolve, reject) {
                resolve(vector);
            });
        } else {
            publicPromise = subtle.importKey(vector.publicKeyFormat, vector.publicKeyBuffer, {name: vector.algorithm.name, hash: vector.hash}, false, publicKeyUsages)
            .then(function(key) {
                vector.publicKey = key;
                return vector;
        function copyBuffer(sourceBuffer) {
            var source = new Uint8Array(sourceBuffer);
            var copy = new Uint8Array(sourceBuffer.byteLength)
            for (var i=0; i<source.byteLength; i++) {
                copy[i] = source[i];
            }
            return copy;
        }
        }
        if (vector.privateKey !== null) {
            privatePromise = new Promise(function(resolve, reject) {
                resolve(vector);
            });
        } else {
            privatePromise = subtle.importKey(vector.privateKeyFormat, vector.privateKeyBuffer, {name: vector.algorithm.name, hash: vector.hash}, false, privateKeyUsages)
            .then(function(key) {
                vector.privateKey = key;
                return vector;
            });
        }
        return Promise.all([publicPromise, privatePromise]);
    }
    function copyBuffer(sourceBuffer) {
        var source = new Uint8Array(sourceBuffer);
        var copy = new Uint8Array(sourceBuffer.byteLength)
        for (var i=0; i<source.byteLength; i++) {
            copy[i] = source[i];
        }
        return copy;
    }
    function equalBuffers(a, b) {
        if (a.byteLength !== b.byteLength) {
            return false;
        }
        var aBytes = new Uint8Array(a);
        var bBytes = new Uint8Array(b);
        for (var i=0; i<a.byteLength; i++) {
            if (aBytes[i] !== bBytes[i]) {
                return false;
            }
        }
        return true;
    }
    return;
}