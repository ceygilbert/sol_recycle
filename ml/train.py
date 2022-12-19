import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.preprocessing import image_dataset_from_directory
import os

# import tensorflowjs as tfjs

print("Num GPUs Available: ", len(tf.config.list_physical_devices("GPU")))
data_directory = "ml/seven_plastics/"

IMG_SIZE = (224, 224)
IMG_SHAPE = IMG_SIZE + (3,)
BATCH_SIZE = 12


def prep_image(image_url):
    img = tf.keras.utils.load_img(image_url, target_size=IMG_SHAPE)
    img_array = tf.keras.utils.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)  # Create a batch
    return img_array


train_dataset = image_dataset_from_directory(
    data_directory,
    validation_split=0.2,
    subset="training",
    seed=321,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
)

validation_dataset = image_dataset_from_directory(
    data_directory,
    validation_split=0.2,
    subset="validation",
    seed=321,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
)


class_names = train_dataset.class_names
print(class_names)

rescale = tf.keras.Sequential([tf.keras.layers.Rescaling(1.0 / 255)])

data_augmentation = tf.keras.Sequential(
    [
        tf.keras.layers.experimental.preprocessing.RandomFlip("horizontal"),
        tf.keras.layers.experimental.preprocessing.RandomRotation(0.1),
        tf.keras.layers.experimental.preprocessing.RandomContrast(0.2),
        tf.keras.layers.experimental.preprocessing.RandomZoom(0.1),
    ]
)

AUTOTUNE = tf.data.AUTOTUNE


def prepare(ds, rescale=False, augment=False):
    # Resize and rescale all datasets.

    if rescale:
        ds = ds.map(
            lambda x, y: (rescale(x, training=True), y), num_parallel_calls=AUTOTUNE
        )

    # Use data augmentation only on the training set.
    if augment:
        ds = ds.map(
            tf.autograph.experimental.do_not_convert(
                lambda x, y: (data_augmentation(x, training=True), y)
            ),
            num_parallel_calls=AUTOTUNE,
        )

    # Use buffered prefetching on all datasets.
    return ds.prefetch(buffer_size=AUTOTUNE)


base_model_name_list = ["efficient_net", "mobile_net", "xception", "inception"]
predictions_dict = {}


def base_model(
    model_type, img_shape, train_dataset, validation_dataset, augment_bool=False
):

    if model_type == "mobile_net":
        model_init = tf.keras.applications.MobileNetV3Large(
            input_shape=img_shape,
            alpha=1.0,
            minimalistic=False,
            include_top=False,
            weights="imagenet",
            pooling=None,
            dropout_rate=0.2,
            classifier_activation="softmax",
            include_preprocessing=True,
        )

        train_dataset = prepare(train_dataset, augment=augment_bool)
        validation_dataset = prepare(validation_dataset)

    elif model_type == "xception":
        model_init = tf.keras.applications.Xception(
            weights="imagenet", input_shape=img_shape, include_top=False
        )

        train_dataset = prepare(train_dataset, augment=augment_bool)
        validation_dataset = prepare(validation_dataset)

    elif model_type == "inception":
        model_init = tf.keras.applications.InceptionV3(
            weights="imagenet", input_shape=img_shape, include_top=False
        )

        train_dataset = prepare(train_dataset, augment=augment_bool)
        validation_dataset = prepare(validation_dataset)

    elif model_type == "efficient_net":
        model_init = tf.keras.applications.EfficientNetV2B0(
            weights="imagenet", input_shape=img_shape, include_top=False
        )

        train_dataset = prepare(train_dataset, augment=augment_bool)
        validation_dataset = prepare(validation_dataset)

    return model_init, train_dataset, validation_dataset


for base_model_name in base_model_name_list:
    for augment in [True, False]:
        base_model_init, train_dataset, validation_dataset = base_model(
            base_model_name,
            IMG_SHAPE,
            train_dataset,
            validation_dataset,
            augment_bool=augment,
        )

        base_model_init.trainable = False

        global_average_layer = tf.keras.layers.GlobalAveragePooling2D()

        prediction_layer = tf.keras.layers.Dense(len(class_names), activation="softmax")

        inputs = tf.keras.Input(shape=IMG_SHAPE)
        if base_model_name in ["xception", "inception"]:
            x = rescale(inputs)
            x = base_model_init(x, training=False)
        else:
            x = base_model_init(inputs, training=False)

        x = tf.keras.layers.Dropout(0.3)(x)
        x = global_average_layer(x)
        x = tf.keras.layers.Dropout(0.3)(x)
        outputs = prediction_layer(x)
        model = tf.keras.Model(inputs, outputs)

        model.compile(
            optimizer=tf.keras.optimizers.Adam(),
            loss=tf.keras.losses.SparseCategoricalCrossentropy(),
            metrics=["accuracy"],
        )

        model.summary()
        epochs = 100
        weights_path = rf"C:\Users\leo__\PycharmProjects\thesis_new\ecosnap2\ml\ecosnap\weights_{base_model_name}.hdf5"
        early_stopping = EarlyStopping(
            monitor="val_loss",
            min_delta=0,
            patience=20,
            verbose=1,
            mode="auto",
            restore_best_weights=True,
        )
        reduce_lr = ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.1,
            patience=30,
            min_lr=0.000001,
            verbose=1,
            mode="min",
        )
        checkpoint = ModelCheckpoint(
            weights_path,
            monitor="val_loss",
            verbose=1,
            save_best_only=True,
            save_weights_only=True,
        )

        history = model.fit(
            train_dataset,
            epochs=epochs,
            validation_data=validation_dataset,
            callbacks=[
                early_stopping,
                reduce_lr,
                checkpoint,
            ],
        )
        # Fine Tuning

        base_model_init.trainable = True
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
            loss=tf.keras.losses.SparseCategoricalCrossentropy(),
            metrics=["accuracy"],
        )

        model.summary()

        history_fine = model.fit(
            train_dataset,
            epochs=50,
            validation_data=validation_dataset,
            callbacks=[
                early_stopping,
                reduce_lr,
                checkpoint,
            ],
        )

        model.load_weights(weights_path)

        ecosnap_save_path = os.path.join("ml", f"{base_model_name}")
        if not augment:
            ecosnap_save_path = os.path.join("ml", f"{base_model_name}_no_aug")
        tf.keras.models.save_model(model, rf"{ecosnap_save_path}/keras")
        tf.saved_model.save(model, rf"{ecosnap_save_path}/9")
        model.save(rf"ml/models/{ecosnap_save_path}")

        # tfjs.converters.save_keras_model(model, f'ml/models/converted/{base_model_name}')
        img_array_1 = prep_image(
            "ml/test/plastic-recycling-code-pete-recycle-symbol-isolated-icon-pete-polyethylene-recycling-code-plastic-recycle-symbol-triangle-159234010.jpg"
        )

        img_array_5 = prep_image("ml/test/pp-plastic_5.jpeg")

        predictions_5 = model.predict(img_array_5)
        predictions_1 = model.predict(img_array_1)

        predictions_dict[
            f"{ecosnap_save_path}"
        ] = "5: {} with a {:.2f} percent confidence.".format(
            class_names[np.argmax(predictions_5)], 100 * np.max(predictions_5)
        )
        predictions_dict[
            f"{ecosnap_save_path}"
        ] = "1: {} with a {:.2f} percent confidence.".format(
            class_names[np.argmax(predictions_1)], 100 * np.max(predictions_1)
        )


print(predictions_dict)
