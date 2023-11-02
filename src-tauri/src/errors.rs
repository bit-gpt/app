use std::fmt::Display;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("{0}")]
    Str(String),

    #[error("{0} -> {1}")]
    ErrorWithCtx(String, String),
}

pub type Result<T> = std::result::Result<T, Error>;

impl From<String> for Error {
    fn from(value: String) -> Self {
        Error::Str(value)
    }
}

pub trait ToResult<T> {
    fn msg(self, msg: impl AsRef<str>) -> Result<T>;
    fn with_msg<K: AsRef<str>>(self, msg: impl Fn() -> K) -> Result<T>;
}

impl<T> ToResult<T> for Option<T> {
    fn msg(self, msg: impl AsRef<str>) -> Result<T> {
        match self {
            Some(s) => Ok(s),
            None => Err(Error::Str(msg.as_ref().to_string())),
        }
    }

    fn with_msg<K: AsRef<str>>(self, msg: impl Fn() -> K) -> Result<T> {
        match self {
            Some(s) => Ok(s),
            None => Err(Error::Str(msg().as_ref().to_string())),
        }
    }
}

impl<T, E: Display> ToResult<T> for std::result::Result<T, E> {
    fn msg(self, msg: impl AsRef<str>) -> Result<T> {
        match self {
            Ok(s) => Ok(s),
            Err(e) => Err(Error::ErrorWithCtx(e.to_string(), msg.as_ref().to_string())),
        }
    }

    fn with_msg<K: AsRef<str>>(self, msg: impl Fn() -> K) -> Result<T> {
        match self {
            Ok(s) => Ok(s),
            Err(e) => Err(Error::ErrorWithCtx(
                e.to_string(),
                msg().as_ref().to_string(),
            )),
        }
    }
}

impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

#[macro_export]
macro_rules! err {
    ($($t:tt)*) => {{
        Err(format!($($t)*))?
    }};
}

#[macro_export]
macro_rules! logerr {
    ($ar:expr $(,)+ $($t:tt)+) => {{
        if let Err(e) = $ar {
            log::error!("{e:?}");
            log::error!($($t)*);
        }
    }};
    ($ar:expr) => {{
        if let Err(e) = $ar {
            log::error!("{e:?}");
        }
    }};
}

#[macro_export]
macro_rules! logsome {
    ($ar:expr, $($t:tt)*) => {{
        if ($ar).is_none() {
            log::error!($($t)*);
        }
    }};
}
