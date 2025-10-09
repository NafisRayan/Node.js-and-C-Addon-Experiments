#include <napi.h>
#include <vector>
#include <string>

// STB
#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image_write.h"

Napi::Value ImageToNumbers(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 1 || !info[0].IsBuffer()) {
    Napi::TypeError::New(env, "Buffer expected").ThrowAsJavaScriptException();
    return env.Null();
  }
  Napi::Buffer<char> buffer = info[0].As<Napi::Buffer<char>>();
  int width, height, channels;
  unsigned char* data = stbi_load_from_memory((unsigned char*)buffer.Data(), buffer.Length(), &width, &height, &channels, 3);
  if (!data) {
    Napi::Error::New(env, "Failed to load image").ThrowAsJavaScriptException();
    return env.Null();
  }
  Napi::Array result = Napi::Array::New(env, width * height * 3);
  for (int i = 0; i < width * height * 3; ++i) {
    result[i] = Napi::Number::New(env, data[i]);
  }
  stbi_image_free(data);
  return result;
}

Napi::Value NumbersToImage(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 3 || !info[0].IsArray() || !info[1].IsNumber() || !info[2].IsNumber()) {
    Napi::TypeError::New(env, "Array, width, height expected").ThrowAsJavaScriptException();
    return env.Null();
  }
  Napi::Array arr = info[0].As<Napi::Array>();
  int width = info[1].As<Napi::Number>().Int32Value();
  int height = info[2].As<Napi::Number>().Int32Value();
  int size = width * height * 3;
  if ((size_t)arr.Length() != size) {
    Napi::Error::New(env, "Array size mismatch").ThrowAsJavaScriptException();
    return env.Null();
  }
  std::vector<unsigned char> data(size);
  for (int i = 0; i < size; ++i) {
    data[i] = arr.Get(i).As<Napi::Number>().Int32Value();
  }
  auto write_func = [](void *context, void *data, int size) {
    std::vector<unsigned char>* vec = (std::vector<unsigned char>*)context;
    vec->insert(vec->end(), (unsigned char*)data, (unsigned char*)data + size);
  };
  std::vector<unsigned char> png_data;
  if (!stbi_write_png_to_func(write_func, &png_data, width, height, 3, data.data(), width * 3)) {
    Napi::Error::New(env, "Failed to write PNG").ThrowAsJavaScriptException();
    return env.Null();
  }
  return Napi::Buffer<unsigned char>::Copy(env, png_data.data(), png_data.size());
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "imageToNumbers"), Napi::Function::New(env, ImageToNumbers));
  exports.Set(Napi::String::New(env, "numbersToImage"), Napi::Function::New(env, NumbersToImage));
  return exports;
}

NODE_API_MODULE(addon, Init)