#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("{0}")]
    Str(String),
}

pub type Result<T> = std::result::Result<T, Error>;

impl From<String> for Error {
    fn from(value: String) -> Self {
        Error::Str(value)
    }
}

pub trait Context {
    type S;
    fn with_context<T: AsRef<str>, K: Fn() -> T>(self, s: K)
        -> std::result::Result<Self::S, Error>;
}

impl<T, E: std::error::Error> Context for std::result::Result<T, E> {
    type S = T;
    fn with_context<S: AsRef<str>, K: Fn() -> S>(self, s: K) -> std::result::Result<T, Error> {
        self.map_err(|e| format!("{}\n:{}", s().as_ref(), e.to_string()).into())
    }
}

impl<T> Context for Option<T> {
    type S = T;
    fn with_context<S: AsRef<str>, K: Fn() -> S>(self, s: K) -> std::result::Result<T, Error> {
        self.ok_or_else(|| s().as_ref().to_string().into())
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
